import getTextByBlockUid from "roamjs-components/queries/getTextByBlockUid";
import getCurrentUserUid from "roamjs-components/queries/getCurrentUserUid";
import createBlock from "roamjs-components/writes/createBlock";
import updateBlock from "roamjs-components/writes/updateBlock";
import resolveRefs from "roamjs-components/dom/resolveRefs";

const TOO_MANY_REQUESTS = {
  STATUS: 429,
  MESSAGE:
    "sorry, you have hit our rate limit for image generation requests. please take a break and try again later.",
};
const GENERIC_ERROR_MESSAGE =
  "sorry, we couldn't generate an image for you. if this issue persists, please contact support@phonetonote.com";
const NO_TEXT_ERROR = "please select a block with text to generate an image";
const GENERATE_IMAGE_LABEL = "Generate Image";
const RETRY_ATTEMPTS = 6;
const RETRY_INITIAL_DELAY = 3000;
const RETRY_SUBSEQUENT_DELAY = 1000;
const PTN_ROOT = "https://app.phonetonote.com";
const BASE_HEADERS = { "Content-Type": "application/json" };
const LOADING_MESSAGE = "loading your image...";

const fetchImage = async (
  targetUid: string,
  jobId: string,
  initialDelay: number,
  totalCount: number,
  newBlockId: string
) => {
  const blockId =
    totalCount === 0
      ? await createBlock({
          parentUid: targetUid,
          order: 0,
          node: { text: LOADING_MESSAGE },
        })
      : newBlockId;

  if (totalCount < RETRY_ATTEMPTS) {
    setTimeout(async () => {
      const response = await fetch(`${PTN_ROOT}/image-generator/url/${jobId}`, {
        method: "GET",
        headers: BASE_HEADERS,
      });
      const { url, error } = await response.json();

      if (error) {
        updateBlock({
          uid: blockId,
          text: error,
        });
      } else if (!url) {
        fetchImage(
          targetUid,
          jobId,
          RETRY_SUBSEQUENT_DELAY * (1 + totalCount),
          totalCount + 1,
          blockId
        );
      } else if (url && url.length > 0) {
        updateBlock({
          uid: blockId,
          text: `![image](${url})`,
        });
      }
    }, initialDelay);
  } else {
    updateBlock({
      uid: blockId,
      text: GENERIC_ERROR_MESSAGE,
    });
  }
};

const generateImage = (targetUid: string, inputPrompt: string) => {
  fetch(`${PTN_ROOT}/image-generator/generate`, {
    method: "POST",
    body: JSON.stringify({ prompt: inputPrompt, roam_id: getCurrentUserUid() }),
    headers: BASE_HEADERS,
  }).then((res) => {
    if (res.status === TOO_MANY_REQUESTS.STATUS) {
      alert(TOO_MANY_REQUESTS.MESSAGE);
    } else {
      res.json().then(({ job_id }) => {
        fetchImage(targetUid, job_id, RETRY_INITIAL_DELAY, 0, undefined);
      });
    }
  });
};

export default {
  onload: () => {
    window.roamAlphaAPI.ui.blockContextMenu.addCommand({
      label: GENERATE_IMAGE_LABEL,
      callback: (props) => {
        const { "block-uid": blockUid, "block-string": blockString } = props;
        if (blockString && blockString.length > 0) {
          generateImage(blockUid, resolveRefs(blockString));
        } else {
          alert(NO_TEXT_ERROR);
        }
      },
    });

    window.roamAlphaAPI.ui.commandPalette.addCommand({
      label: GENERATE_IMAGE_LABEL,
      callback: () => {
        const targetUid = window.roamAlphaAPI.ui.getFocusedBlock()?.["block-uid"];
        const textOnBlock = targetUid ? getTextByBlockUid(targetUid) : undefined;
        if (textOnBlock) {
          generateImage(targetUid, resolveRefs(textOnBlock));
        }
      },
    });
  },
  onunload: () => {
    window.roamAlphaAPI.ui.blockContextMenu.removeCommand({ label: GENERATE_IMAGE_LABEL });
    window.roamAlphaAPI.ui.commandPalette.removeCommand({ label: GENERATE_IMAGE_LABEL });
  },
};
