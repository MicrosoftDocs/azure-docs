
# Introduction to prompt engineering with GPT-4 Turbo with Vision

To unlock the full potential of GPT-4 Turbo with Vision, it's essential to tailor the system prompt to your specific needs. Here are some guidelines to enhance the accuracy and efficiency of your prompts.

## Crafting your prompt

1.	**Contextual specificity:** For instance, if you're working on image descriptions for a product catalog, ensure your prompt reflects this. A prompt like “Describe images for an outdoor hiking product catalog, focusing on enthusiasm and professionalism” guides the model to generate responses that are both accurate and contextually rich. This level of specificity aids in focusing on relevant aspects and avoiding extraneous details.
2.	**Task-oriented prompts:** If your project involves analyzing videos for auto insurance claims, your prompt should be precisely tailored to this task. For example, “Analyze this car damage video for an auto insurance report, focusing on identifying and detailing damage.” This prompt steers the model to concentrate on elements crucial for insurance assessments, thereby improving accuracy and relevancy.
3.	**Handling refusals:** When the model indicates an inability to perform a task, refining the prompt can be an effective solution. More specific prompts can guide the model towards a clearer understanding and better execution of the task. See (handling refusal)[] for more guidance.
4.	See below for some **example prompts** for varying use cases.

|Use case|Example system prompt|
|--------|-----------|
|Image Description| "As an AI assistant, provide a clear, detailed sentence describing the content depicted in this image." |
| Image Tagging | "Identify and list prevalent tags associated with the content of this image." |
| Defect Detection | "Act as a professional defect detector. Compare this test image with a reference image and state 'No defect detected' or 'Defect detected', providing detailed reasoning." |
| Car Insurance Damage Report Writing | "Function as a car insurance and accident expert. Extract detailed information about the car's make, model, damage extent, license plate, airbag deployment status, etc., and present the results in JSON format." |


## Handling refusal

If you are getting consistent refusal responses from the model, here are some strategies to keep in mind:

- Make sure you are providing clear and concise instructions for GPT-4 Turbo with Vision
- Request explanations for generated responses to enhance transparency in the model's output
- Add examples that represent the type of responses you're looking for
- Try prompt tuning techniques such as Chain of Thought
- Try breaking down complex requests step-by-step to create manageable sub-goals
- Clearly mention the desired format for the output, such as markdown, JSON, HTML, etc. You can also suggest a specific structure or 
- If using a single-image prompt, place the image before the text for optimal performance

## Example prompt inputs & outputs






These guidelines and examples demonstrate how tailored system prompts can significantly enhance the performance of GPT-4 Turbo with Vision, ensuring that the responses are not only accurate but also perfectly suited to the specific context of the task at hand.
