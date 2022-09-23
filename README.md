# image generator

generate Stable Diffusion images straight from roam.

<video src="https://user-images.githubusercontent.com/1139703/191873385-db352955-f334-4cfe-930a-329157d768f4.mp4" controls="controls"></video>

# usage

no signup required, just install the plugin and start generating images.

after installing this plugin, you can generate an image from a block of text in two ways:

- Command Palette (cmd + p) → Generate Image
- Block Context Menu (right blick on a block) → plugins → Generate Image

the text will be the prompt for the image.

the image will be generated as a child, directly beneath the text.

the generated image is hosted on a publicly readable cloudflare r2 bucket. the path and name of the image is randomly generated, and robots cannot crawl the bucket. this makes your images accessible and sharable by URL, but un-guessable by others. the cloudflare bucket is owned and operated by [phonetonote](https://phonetonote.com)

we convert block refs to text and strip `[[` and `]]` from page references. text is trimmed to ~77 words, as the model does not perform well on prompts longer than that.

you will be alerted about a rate limit if you reach it.

if generating an image fails for any reason, including if the model thinks the prompt is NSFW, the error will display instead of the image.

# model details

this plugin uses [Replicate's Stable Diffusion v1.4 model](https://replicate.com/stability-ai/stable-diffusion) and is subject to the same usage rules.

## Misuse, Malicious Use, and Out-of-Scope Use

Note: This section is taken from the DALLE-MINI model card, but applies in the same way to Stable Diffusion v1.

The model should not be used to intentionally create or disseminate images that create hostile or alienating environments for people. This includes generating images that people would foreseeably find disturbing, distressing, or offensive; or content that propagates historical or current stereotypes.

## Out-of-Scope Use

The model was not trained to be factual or true representations of people or events, and therefore using the model to generate such content is out-of-scope for the abilities of this model.

## Misuse and Malicious Use

Using the model to generate content that is cruel to individuals is a misuse of this model. This includes, but is not limited to:

- Generating demeaning, dehumanizing, or otherwise harmful representations of people or their environments, cultures, religions, etc.
- Intentionally promoting or propagating discriminatory content or harmful stereotypes.
- Impersonating individuals without their consent.
- Sexual content without consent of the people who might see it.
- Mis- and disinformation
- Representations of egregious violence and gore
- Sharing of copyrighted or licensed material in violation of its terms of use.
- Sharing content that is an alteration of copyrighted or licensed material in violation of its terms of use.

## Limitations and Bias

### Limitations

- The model does not achieve perfect photorealism
- The model cannot render legible text
- The model does not perform well on more difficult tasks which involve compositionality, such as rendering an image corresponding to “A red cube on top of a blue sphere”
- Faces and people in general may not be generated properly.
- The model was trained mainly with English captions and will not work as well in other languages.
- The autoencoding part of the model is lossy
- The model was trained on a large-scale dataset [LAION-5B](https://laion.ai/blog/laion-5b/) which contains adult material and is not fit for product use without additional safety mechanisms and
  considerations.
- No additional measures were used to deduplicate the dataset. As a result, we observe some degree of memorization for images that are duplicated in the training data.
  The training data can be searched at https://rom1504.github.io/clip-retrieval/ to possibly assist in the detection of memorized images.

### Bias

While the capabilities of image generation models are impressive, they can also reinforce or exacerbate social biases.
Stable Diffusion v1 was trained on subsets of [LAION-2B en](https://laion.ai/blog/laion-5b/),
which consists of images that are primarily limited to English descriptions.
Texts and images from communities and cultures that use other languages are likely to be insufficiently accounted for.
This affects the overall output of the model, as white and western cultures are often set as the default. Further, the ability of the model to generate content with non-English prompts is significantly worse than with English-language prompts.

Please see the [Replicate Page](https://replicate.com/stability-ai/stable-diffusion) for more details on how the model was trained.
