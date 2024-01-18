
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
There are many ways to craft system prompts to tailor the output specifically to your needs. See below for some sample inputs and outputs with complex requests for the model. Try the model out for yourself using these images and adjusting the system prompt in the [Azure AI Studio playground](ai.azure.com).

|Image|Example system prompt|Simple model output|
|--------|-----------|-------|
| (!Real estate image)[] | You are an AI assistant that writes detailed listings for vacation rental properties. Summarize in three sentences the optimal features of the listing, based on only what is visible in the image. Conclude with one sentence on why the customer should book today. | This idyllic villa showcases an inviting private pool with steps for easy access, framed by a beautifully tiled sun deck and comfortable loungers ideal for soaking up the sun or enjoying a good book under the shade of tropical palms. Architectural charm is evident in the villa's design, featuring elegant archways, a thatched-roof gazebo, and balconies that promise serene views and a perfect spot to savor your morning or evening beverages. The lush greenery surrounding the property not only provides privacy but also enhances the sense of an exclusive paradise retreat. Don't miss the opportunity to secure this perfect blend of luxury and tranquility – book today for a tropical escape like no other! | 
| (!Recipe image)[] | You are an AI assistant that helps create shopping lists and instructions to prep food based on recipes. Please provide a list of ingredients to purchase, and then provide a list of instructions to prep the ingredients based on the recipe card. | Sure, here's a shopping list based on the recipe card: <br>Shopping List:</br><ol><li>5-7 apples (suitable for baking, such as Granny Smith or Honeycrisp)</li> <li>1 ready-made pie crust (9-inch) </li><li>Sugar (ensure you have enough for 1/2 cup)</li><li>All-purpose flour (ensure you have enough for 3/4 cup)</li><li>Ground cinnamon</li><li>Salt</li><li>Butter (ensure you have enough for 3 tablespoons)</li></ol><br>Prepping Instructions:</br> <ul><li>Peel the apples: Using a vegetable peeler or a paring knife, remove the skin from 5 to 7 apples.</li><li>Core and slice the apples: Cut the apples into quarters, remove the cores, and then slice the apple quarters into thin slices or chunks, depending on your preference for pie texture.</li><li>Measure the ingredients: Measure out 3/4 cups of sugar, 1/2 teaspoon of cinnamon, a dash of salt (about 1/8 teaspoon), and 3 tablespoons of butter.</li><li>Prepare the butter: Cut the butter into small pieces to be ready to use in the recipe. It's often easier to incorporate if it's cold, so keep it refrigerated until it's needed</li><li>Preheat your oven according to the pie recipe's instructions so it's ready for baking once your pie is assembled.</li><li>Remember to follow any additional preparation or baking instructions provided in the full recipe for your apple crumb pie.</li></ul>|
|  |  |



These guidelines and examples demonstrate how tailored system prompts can significantly enhance the performance of GPT-4 Turbo with Vision, ensuring that the responses are not only accurate but also perfectly suited to the specific context of the task at hand.
