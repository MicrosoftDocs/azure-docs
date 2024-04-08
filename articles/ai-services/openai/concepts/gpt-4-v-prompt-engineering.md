---
title: Introduction to prompt engineering with GPT-4 Turbo with Vision
titleSuffix: Azure OpenAI
description: Learn how to better engineer prompts for GPT-4 Turbo with Vision.
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 01/30/2024
manager: nitinme
---

# Introduction to prompt engineering with GPT-4 Turbo with Vision

To unlock the full potential of GPT-4 Turbo with Vision, it's essential to tailor the system prompt to your specific needs. Here are some guidelines to enhance the accuracy and efficiency of your prompts.

## Fundamentals of crafting your prompt
- **Contextual specificity:** Adding context to the scenario at hand gives the model a better understanding of an appropriate output. This level of specificity aids in focusing on relevant aspects and avoiding extraneous details.
- **Task-oriented prompts:** Focusing on a specific task helps the model to develop the output while taking that perspective into consideration.  
- **Handling refusals:** When the model indicates an inability to perform a task, refining the prompt can be an effective solution. More specific prompts can guide the model towards a clearer understanding and better execution of the task. Some tips to keep in mind: 

   - Request explanations for generated responses to enhance transparency in the model's output <br>
   - If using a single-image prompt, place the image before the text <br>
   - Ask the model to describe the image in details first and complete your specific task from the description

- **Adding examples:** Add examples that represent the type of responses you're looking for
- **Try prompt tuning:** Try prompt tuning techniques such as Chain of Thought, a technique where you describe a sequence of steps leading to an outcome, therefore communicating a sort of “chain of thought” or thought process for the model to replicate.
- **Break down requests:** Try breaking down complex requests step-by-step to create manageable sub-goals
- **Define output format:** Clearly mention the desired format for the output, such as markdown, JSON, HTML, etc. You can also suggest a specific structure, length, or specific attributes about the response.

## Example prompt inputs & outputs
There are many ways to craft system prompts to tailor the output specifically to your needs. The following sample inputs and outputs showcase how adjusting your prompts can give you different results. Try the model out for yourself using these images and adjusting the system prompt in the [Azure AI Studio playground](https://ai.azure.com/).

### Contextual specificity  
Context can help improve feedback from the model. For example, if you're working on image descriptions for a product catalog, ensure your prompt reflects this in a clear and concise way. A prompt like “Describe images for an outdoor hiking product catalog, focusing on enthusiasm and professionalism” guides the model to generate responses that are both accurate and contextually rich.

|Basic prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/tent-chairs.jpg" lightbox="../media/concepts/gpt-v/tent-chairs.jpg" alt-text="Photograph of a camping tent and chairs in a forest."::: What is in this image? | The image shows a camping setup in a forest area. There is a yellow tent, two folding camping chairs—one red and one blue—and a portable camping table. The surrounding area is densely populated with trees, indicating that the campsite is in a wooded region. |

|Updated prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/tent-chairs.jpg" lightbox="../media/concepts/gpt-v/tent-chairs.jpg" alt-text="Photograph of a camping tent and chairs in a forest."::: Describe images for an outdoor hiking product catalog, focusing on enthusiasm and professionalism. | "Embark on your next outdoor adventure with our premium hiking and camping essentials! Featured here is our vibrant, spacious tent, designed to be your home away from home amidst the serenity of nature. Crafted with top-notch materials, it promises durability and comfort in any weather. Complementing the tent are our ultra-comfortable, lightweight folding chairs, available in eye-catching red and serene blue, perfect for those moments of relaxation after a day of exploration. Don't forget our sturdy, portable table, ideal for a delightful outdoor meal or a game of cards under the stars. Elevate your camping experience with our reliable products, where quality meets the great outdoors!" |


### Task-oriented prompts
Giving the model a specific task to follow is one way of sharpening the response. In this example, this prompt steers the model to concentrate on elements crucial for insurance assessments, thereby improving accuracy and relevancy.

|Basic prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/car-crash.jpg" lightbox="../media/concepts/gpt-v/car-crash.jpg" alt-text="Photograph of a car crashed into a pole."::: What is in this image? | The image shows a silver sedan that has been in an accident. The front end of the car is damaged, with the hood crumpled, and the bumper partially detached. The car is resting against a utility pole on the sidewalk, and there is visible smoke coming from the engine area, indicating a recent crash. The setting appears to be a residential street, as indicated by the presence of houses in the background, a neatly trimmed hedge, and a sidewalk. |

|Updated prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/car-crash.jpg" lightbox="../media/concepts/gpt-v/car-crash.jpg" alt-text="Photograph of a car crashed into a pole."::: Analyze this car damage video for an auto insurance report, focusing on identifying and detailing damage | In the image provided, we observe a silver sedan that has sustained significant front-end damage. The vehicle's hood is notably crumpled, and the front bumper has suffered substantial deformation, partially detaching from the chassis. The right headlamp assembly appears to be damaged or dislodged. There is also visible damage to the front grille area. The car is in contact with a utility pole, suggesting a frontal collision with the pole at a relatively low or moderate speed. Smoke is emanating from the engine compartment, suggesting potential mechanical or electrical damage that may need further inspection for a comprehensive assessment. The airbags do not appear to be deployed in this image. The vehicle will require a detailed inspection to evaluate the full extent of structural and mechanical damage for a complete insurance report. |

### Handling refusals
When you receive a refusal output from a model, there are several ways you can tweak input to generate a more appropriate response. Below is one example of how to handle a refusal and progress. 

|Basic prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/dinner-spread.jpg" lightbox="../media/concepts/gpt-v/dinner-spread.jpg" alt-text="Photograph of a dinner table with several plates of food."::: Plan this meal | Sorry, I can't provide that information. |

|Follow up prompt|Model output|
|--------|-----------|
| What information do you need? | I apologize for the confusion earlier. To plan a meal based on the image provided, I would need to know the following: <br> The number of people dining to ensure there's enough food for everyone.<br>Any dietary restrictions or preferences to accommodate (e.g., vegetarian, gluten-free, allergies).<br>The occasion or type of meal being planned (e.g., casual lunch, dinner party).<br>Desired balance of the meal in terms of food groups and nutrition. <br>With this information, I could help suggest how to portion the dishes, create a balanced meal, and ensure the meal meets the needs of all diners.|

### Adding examples

|Basic prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/border-collie.jpg" lightbox="../media/concepts/gpt-v/border-collie.jpg" alt-text="Photograph of a border collie dog laying in a grass field."::: What is this dog breed and what is its average weight and height? | The dog in the image appears to be a Border Collie. Border Collies are known for their intelligence, agility, and herding abilities.The average weight for a Border Collie is typically around 30-45 pounds (14-20 kilograms). As for height, Border Collies generally stand about 18-22 inches (46-56 centimeters) tall at the shoulder. These figures can vary based on the individual dog's genetics, diet, and level of activity. Border Collies are medium-sized dogs with a well-proportioned body and a high level of energy. |

|Updated prompt|Model output|
|--------|-----------|
| Q: What is this dog breed and what is its average weight & height? :::image type="content" source="../media/concepts/gpt-v/pomeranian.jpg" lightbox="../media/concepts/gpt-v/pomeranian.jpg" alt-text="Photograph of a pomeranian dog sitting on a pool diving board above the water."::: <br> A: Breed: pomeranian; average weight: 3-7 lbs; average height: 8-14 inches <br> :::image type="content" source="../media/concepts/gpt-v/bulldog.jpg" lightbox="../media/concepts/gpt-v/bulldog.jpg" alt-text="Photograph of a bulldog laying in a grass field."::: A: Breed: English bulldog; average weight: 50-55 lbs; average height: 14-16 inches :::image type="content" source="../media/concepts/gpt-v/border-collie.jpg" lightbox="../media/concepts/gpt-v/border-collie.jpg" alt-text="Photograph of a border collie dog laying in a grass field."::: | A: Breed: Border Collie; average weight: 30-45 lbs; average height: 18-22 inches |

### Try prompt tuning
Using the chain of thought prompt technique below, you can guide the model to follow a thought process to achieve the correct answer.

|Basic prompt|Model output|
|--------|-----------|
| Q: Alex has 8 cookies. She buys 2 more boxes of 4 cookies each. How many cookies does she have? <br> A: 16 <br> Q: Alex has 20 balloons for a party, but 3 of them pop. She buys 10 more balloons. How many balloons does she have?| A: 27 |

|Updated prompt|Model output|
|--------|-----------|
| Q: Alex has 8 cookies. She buys 2 more boxes of 4 cookies each. How many cookies does she have? <br> A: Alex started with 8 cookies and bought two more boxes of 4 each. 2 x 4 = 8, and 8 + 8 = 16. <br> Q: Alex has 20 balloons for a party, but 3 of them pop. She buys 10 more balloons. How many balloons does she have? | A: Alex started with 20 balloons, but 3 popped, leaving her with 17 balloons. She then bought 10 more, so she has 17 + 10 = 27 balloons. |

### Break down requests

|Basic prompt|Model output|
|--------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/grandmas-recipe.jpg" lightbox="../media/concepts/gpt-v/grandmas-recipe.jpg" alt-text="Photograph of a recipe card detailing a recipe for Grandma's Apple Crumb Pie."::: What's in this image? | The image contains a recipe card titled Grandma's Apple Crumb Pie. It is noted as a Thanksgiving tradition. The ingredients listed are:<br><ul><li>5-7 apples, peeled </li> <li>1 9-inch pie crust</li> <li>	3/4 cups sugar </li> <li>1/2 teaspoon cinnamon </li> <li>A dash of salt </li><li>	3 tablespoons butter</li> </ul><br>Please note that the measurements for sugar, flour, and butter are not fully visible in the image. If needed, the standard measures for a crumb topping typically involve a combination of sugar, flour, and butter mixed together until crumbly|

|Updated prompt|Model output|
|----------|-----------|
| :::image type="content" source="../media/concepts/gpt-v/grandmas-recipe.jpg" lightbox="../media/concepts/gpt-v/grandmas-recipe.jpg" alt-text="Photograph of a recipe card detailing a recipe for Grandma's Apple Crumb Pie."::: You are an AI assistant that helps create shopping lists and instructions to prep food based on recipes. Please provide a list of ingredients to purchase, and then provide a list of instructions to prep the ingredients based on the recipe card.  | Sure, here's a shopping list based on the recipe card: <br>Shopping List:</br><ol><li>5-7 apples (suitable for baking, such as Granny Smith or Honeycrisp)</li> <li>1 ready-made pie crust (9-inch) </li><li>Sugar (ensure you have enough for 1/2 cup)</li><li>All-purpose flour (ensure you have enough for 3/4 cup)</li><li>Ground cinnamon</li><li>Salt</li><li>Butter (ensure you have enough for 3 tablespoons)</li></ol><br>Prepping Instructions:</br> <ul><li>Peel the apples: Using a vegetable peeler or a paring knife, remove the skin from 5 to 7 apples.</li><li>Core and slice the apples: Cut the apples into quarters, remove the cores, and then slice the apple quarters into thin slices or chunks, depending on your preference for pie texture.</li><li>Measure the ingredients: Measure out 3/4 cups of sugar, 1/2 teaspoon of cinnamon, a dash of salt (about 1/8 teaspoon), and 3 tablespoons of butter.</li><li>Prepare the butter: Cut the butter into small pieces to be ready to use in the recipe. It's often easier to incorporate if it's cold, so keep it refrigerated until it's needed</li><li>Preheat your oven according to the pie recipe's instructions so it's ready for baking once your pie is assembled.</li><li>Remember to follow any additional preparation or baking instructions provided in the full recipe for your apple crumb pie.</li></ul> |

### Define output format

|Basic prompt|Model output|
|----------|-----------|
|:::image type="content" source="../media/concepts/gpt-v/rental-listing.jpg" lightbox="../media/concepts/gpt-v/rental-listing.jpg" alt-text="Photograph of a white villa in a tropical region with a pool."::: Describe this image | The image shows a luxurious white villa with a traditional thatched roof on one section and a clear blue swimming pool in the foreground. There are sun loungers lined up along the poolside, inviting relaxation. The architecture includes elegant archways, a balcony with wooden railings, and large windows and doors that suggest a bright and airy interior. The villa is surrounded by lush tropical vegetation, including tall palm trees, which adds to the serene and exotic ambiance of the setting. |

|Updated prompt|Model output|
|----------|-----------|
|:::image type="content" source="../media/concepts/gpt-v/rental-listing.jpg" lightbox="../media/concepts/gpt-v/rental-listing.jpg" alt-text="Photograph of a white villa in a tropical region with a pool."::: You are an AI assistant that writes detailed listings for vacation rental properties. Summarize in three sentences the optimal features of the listing, based on only what is visible in the image. Conclude with one sentence on why the customer should book today. | This idyllic villa showcases an inviting private pool with steps for easy access, framed by a beautifully tiled sun deck and comfortable loungers ideal for soaking up the sun or enjoying a good book under the shade of tropical palms. Architectural charm is evident in the villa's design, featuring elegant archways, a thatched-roof gazebo, and balconies that promise serene views and a perfect spot to savor your morning or evening beverages. The lush greenery surrounding the property not only provides privacy but also enhances the sense of an exclusive paradise retreat. Don't miss the opportunity to secure this perfect blend of luxury and tranquility – book today for a tropical escape like no other! |


These guidelines and examples demonstrate how tailored system prompts can significantly enhance the performance of GPT-4 Turbo with Vision, ensuring that the responses are not only accurate but also perfectly suited to the specific context of the task at hand.
