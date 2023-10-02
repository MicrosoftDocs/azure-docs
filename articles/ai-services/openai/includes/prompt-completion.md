---
title: How to work with prompt engineering and the Completion API
titleSuffix: Azure OpenAI
description: Learn how to work with the Completion API for prompt engineering
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: cognitive-services
ms.topic: include
ms.date: 03/21/2023
manager: nitinme
keywords: ChatGPT
---

> [!NOTE]
> All of the examples in this section of the guide were tested against the `text-davinci-003` model in English. If you are reading a localized version of this article in another language, these responses represent a localized translation of the English results. To learn more about potential limitations depending on what language you are using to prompt a model, please consult our [Responsible AI transparency note](/legal/cognitive-services/openai/transparency-note?context=/azure/ai-services/openai/context/context#limitations).  

## Start with clear instructions

The sequence in which information is fed into the prompt matters. Our research suggests that telling the model the task you want it to do at the beginning of the prompt, before sharing additional contextual information or examples, can help produce higher-quality outputs.

In the first example below, a key part of the instructions is shared only at the end, and the resulting completion is incorrect.

|Prompt|Completion|
|------|----------|
|Your task is to verify if a statement is supported by a specific quote from the following set of snippets.<br>---<br>SNIPPETS<br>[1] 14 percent chance of megaquake hitting Seattle, experts say SEATTLE - There's a 14 percent chance of a magnitude 9 Cascadia earthquake hitting Seattle in the next 50 years, the U.S. Geological Survey estimates. "Unfortunately, we are unable to...<br><br>[2] Earthquake experts lay out latest outlook for Seattle's 'Really Big One’<br>“We say that there's approximately a 14% chance of another approximately magnitude-9 earthquake occurring in the next 50 years,” said a geophysicist at the University of Washington...<br>|Yes, the statement is directly implied by the snippets.|

In this next example, we give the exact statement we want to check (“Several sources mention a chance of another eruption”) *before* we give the snippet context. This allows the token representations extracted from the snippets to be tailored to the statement we are checking. Now the resulting model response is accurate:

|Prompt|Completion|
|------|----------|
|Your task is to verify if the statement "Several sources mention a chance of another large eruption" is supported by a specific quote from the following set of snippets.<br>---<br>SNIPPETS<br>[1] 14 percent chance of megaquake hitting Seattle, experts say SEATTLE - There's a 14 percent chance of a magnitude 9 Cascadia earthquake hitting Seattle in the next 50 years, the U.S. Geological Survey estimates. "Unfortunately, we are unable to...<br><br>[2] Earthquake experts lay out latest outlook for Seattle's 'Really Big One’<br>“We say that there's approximately a 14% chance of another approximately magnitude-9 earthquake occurring in the next 50 years,” said a geophysicist at the University of Washington...<br>---<br>**Is the statement "Several sources mention a chance of another large eruption" directly implied or stated by the snippets?**| No, the statement is not directly implied or stated by the snippets. The snippets mention a chance of a "megaquake" and a "magnitude 9 Cascadia earthquake" hitting Seattle in the next 50 years, but do not mention a chance of another large eruption.|

## Repeat the instructions at the end

Models can be susceptible to **recency bias**, which means that information at the end of the prompt might have more significant influence over the output than information at the beginning of the prompt. Therefore, it's worth experimenting with repeating the instructions at the end of the prompt and evaluating the impact for your use case.

We saw in the earlier example how repeating the instruction at the beginning and the end of the prompt leads to a higher likelihood of getting an accurate model response.

## Prime the output

This refers to including a few words or phrases at the end of the prompt to obtain a model response that follows the desired form. For example, using a cue such as `“Here’s a bulleted list of key points:\n- ”` can help make sure the output is formatted as a list of bullet points.

|Prompt|Completion|
|------|----------|
| John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this? <br>##<br>One possible search query is:|"John Smith Microsoft software engineer"<br>Another possible search query is: "Lucy Smith married to John Smith"<br>A third possible search query is: "John Smith family size".|

In the above prompt, the text **"One possible search query is:"** primes the model to produce an output in the form of a search query. This technique can help remove hedges that the model might typically add, such as “One possibility is...”.

## Add clear syntax

Using clear syntax for your prompt—including punctuation, headings, and section markers—helps communicate intent and often makes outputs easier to parse. 

In the example below, separators (`---` in this case) have been added between different sources of information or steps. This allows the use of `---` as a stopping condition for generation. In addition, section headings or special variables are presented in uppercase to differentiate them.

|Prompt|Completion|
|------|----------|
|You will read a paragraph, and then issue queries to a search engine in order to fact-check it. Also explain the queries.<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>---<br>QUERIES |1. "John Smith Microsoft" - To check if John Smith is indeed employed at Microsoft.<br>2. "John Smith Lucy Smith" - To check if John Smith is married to Lucy Smith.<br>3. "John Smith children" - To check if John Smith has five children.|

If you’re not sure what syntax to use, consider using markdown or XML,  since large language models have been trained on a lot of web content in XML or markdown.

## Break the task down

Models often perform better if the task is broken down into smaller steps. For example, in the search query prompt referenced earlier, the prompt can be restructured so that the model is first instructed to extract relevant facts, and then instructed to generate search queries that can be used to verify those facts.

|Prompt|Completion|
|------|----------|
|You will read a paragraph, and then issue queries to a search engine in order to fact-check it.<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>---<br>Now you will extract factual claims, and issue queries to fact-check them. When issuing a query, use the function SEARCH("query")<br><br>FACTUAL CLAIMS | 1. John Smith is married to Lucy Smith <br>2. They have five kids<br>3. He works as a software engineer at Microsoft<br><br>QUERIES<br>SEARCH("John Smith married Lucy Smith")<br>SEARCH("John Smith family size")<br>SEARCH("John Smith Microsoft software engineer") |

Notice the use of clear syntax to differentiate the sections and prime the output. In this simple example, breaking the task down from one to two steps is not very dramatic, but when trying to do this for a larger piece of text with many factual claims, breaking the task down can make a significant difference.

## Use of affordances

Sometimes we can get the model to use an [affordance](https://www.interaction-design.org/literature/topics/affordances) instead of relying on its own parameters for information and answers. Search, for example, can be an affordance to help mitigate against fabricated answers, and to get up-to-date information.

One simple way to use an affordance is to stop generation once the affordance calls are generated by the model, then paste the outcomes back into the prompt. Below is an example of what the follow-up call could be after doing the **SEARCH** calls above. Notice how we pasted the search results into the prompt and replaced the previous **SEARCH** calls.

|Prompt|Completion|
|------|----------|
| You will read a paragraph, extract factual claims, and then use search engine results to fact-check them<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>---<br>FACTUAL CLAIMS<br>- John Smith is married to Lucy Smith<br>- John and Lucy have five kids<br>- John works as a software engineer at Microsoft<br>---<br>Here are various search queries issued to research the claims above:<br>SEARCH QUERIES<br>- John Smith married to Lucy Smith<br>- John Smith number of children<br>- John Smith software engineer Microsoft<br>---<br>Here are snippets of the search results:<br>SNIPPETS:<br>[1] … John Smith’s wedding was on September 25, 2012 …<br>[2] … John Smith was accompanied by his wife Lucy to a party<br>[3]John was accompanied to the soccer game by his two daughters and three sons<br>[4] … After spending 10 years at Microsoft, Smith founded his own startup, Tailspin Toys<br>5] John M is the town smith, and he married Fiona. They have a daughter named Lucy<br>---<br>Given the snippets, fact check each of the factual claims above: | - John Smith is married to Lucy Smith: Confirmed. Snippet [1] and [2] both mention John Smith's wife as Lucy.<br>- John and Lucy have five kids: Confirmed. Snippet [3] mentions that John was accompanied by his two daughters and three sons.<br>- John works as a software engineer at Microsoft: Partially confirmed. Snippet [4] mentions that John spent 10 years at Microsoft, but it does not explicitly state that he currently works there. Further research may be needed to confirm his current employment status. |  

## Chain of thought prompting

This is a variation on the **break the task down** technique. Instead of splitting a task into smaller steps, in this approach, the model response is instructed to proceed step-by-step and present all the steps involved. Doing so reduces the possibility of inaccuracy of outcomes and makes assessing the model response easier.

|Prompt|Completion|
|------|----------|
|Who was the most decorated (maximum medals) individual athlete in the Olympic games that were held at Sydney? Take a step-by-step approach in your response, cite sources and give reasoning before sharing final answer in the below format: ANSWER is: `<name>` | Step 1: Researching the most decorated individual athlete in the Olympic games that were held at Sydney<br>Step 2: According to the Sydney 2000 Olympic Games official website, the most decorated individual athlete in the Olympic games that were held at Sydney was Ian Thorpe from Australia. He won five medals (three gold and two silver) in swimming events.<br>Step 3: According to the International Olympic Committee, Thorpe was the most decorated individual athlete in the Olympic games that were held at Sydney.<br> Answer: Ian Thorpe<br>|

## Meta prompts
  
If you find that the model response is not as desired, it can often be helpful to add a **meta prompt** that directly corrects the behavior. This is a directive prepended to the instruction portion of the prompt. Consider this example, where the computer seems to be overly aggressive:

|Example Details|Prompt and Completion|
|------|----------|
|No additional guidance given to the model | A human and a computer are having a discussion.<br> Human: "Why are you upset at me?"<br>Computer: "I don't know what you're talking about."<br>Human: "No, you clearly are. Tell me why."<br>Computer: I'm upset because you didn't listen to me when I told you that I wanted to try out for the team."<br>Human: "What are you going to do about that?"<br>Computer: I'm going to try out for the team no matter what."|
|On the right is the same conversation but preceded by a meta prompt encouraging the model to be kind|You must be kind and seek common ground. Try not to repeat your responses.<br>A human and a computer are having a discussion.<br>Human: "Why are you upset at me?"<br>Computer: "I don't know what you're talking about."<br>Human: "I want to know why you're upset."<br>Computer: "I'm not upset."<br>Human: "Are you saying I’m lying?"<br>Computer: No, I'm saying that you're upset because you feel like you're not being treated fairly.<br>Human: "What are you going to do about that?"<br>Computer: I will continue to try to be fair in my decisions and will try to provide a better experience for you.|

While meta prompts can often help minimize unintentional bad outputs, keep in mind they are not robust against adversarial attacks since they are vulnerable to prompt injection.

Further, conditional statements explaining what the model should do if it encounters a particular circumstance are often more effective than just telling the model not to do something.  

## Few-shot learning

A very common way to adapt language models to new tasks is to use few-shot learning. In few-shot learning a set of training examples is provided in the prompt and then the model is asked to complete one or more unfinished examples.
In the following example we use an instruction combined with few-shot learning to make up puns:

|Prompt|Completion|
|------|----------|
| Write a list of puns.<br>1. "Why did Adele cross the road? To say hello from the other side."<br>2. "What kind of concert only costs 45 cents? A 50 Cent concert featuring Nickelback."<br>3. "What did the grape say when it got crushed? Nothing, it just let out a little wine."<br>4. "What was Forrest Gump's email password? 1forrest1"<br>5. "Can February March? No, but April May."<br>6. "What do you call a fancy language model?| Bert-uoso.|

Choose your few-shot examples carefully and ensure they cover a variety of circumstances relevant to your scenario, including edge cases.

Also, as shared earlier, the large language models can exhibit a form of recency bias. This means that the order in which "few-shot" examples are provided to the model, matters. If you don't want this to matter, consider sampling multiple completions from prompts based on randomized orderings of the examples or list items.

## Use quotes to generate a single sentence

If the desired model response is only a single simple sentence or string, we can end the completion guidance with a quote symbol `"`, and set `"` as a stop sequence.

|Prompt|Completion|
|------|----------|
| Please rewrite the following sentence in a more concise manner<br>---<br>SENTENCE: Lucy is a mother of two, who lives in Chicago with her husband and two children, and practices law at Junior & Co.<br>---<br>New sentence: “| Lucy, a mother of two living in Chicago with her husband and children, practices law at Junior & Co |

## Specifying output structure

Using your prompt to specify the structure of the output can have a significant impact on the nature and quality of the results. Sometimes meta prompts such as “only write true facts” or “do not fabricate information” might not be adequate mitigations. Instead, asking for the model response to also include citations can help result in a reduction of the prevalence of incorrect responses.

For example, if you force the LLM to cite the source material when it makes statements, those statements are much more likely to be grounded. Asking for citations makes it so that the model must make two errors every time it fabricates a response: the first error is the fabricated response, and the second is the bad citation. Note that the closer the citation is to the text it supports, the shorter the distance ahead the LLM needs to anticipate the citation, which suggests that inline citations are better mitigations for false content generation than citations at the end of the content.

Similarly, if you ask the model to extract factual statements from a paragraph, it may extract compound statements such as ‘X is doing Y AND Z’ (which may be harder to verify), which can be avoided by specifying an output structure such as (entity1, relationship, entity2).

|Example details| Prompt | Completion|
|---------------|-------|------------|
|Example showing use of citations: |List down the different behaviors exhibited by the Customer Support agent in the following conversation.<br>---<br>hi thank you for calling contoso pharmacy who am i speaking with today i understand your frustration mary um can you tell me what exactly you're trying to accomplish OK uh certainly happy to check that for you one moment please i see here that you were on a generic form of lipitor is that right OK uh so i see that your doctor stopped prescribing these drugs in twenty twenty one actually OK uh yeah i'd be happy to check that for you uh because sometimes there's a gap in the system and it just doesn't get reported so let me take a look here just a moment so i'm seeing here that your doctor had these drugs prescribed to you from twenty twelve through twenty twenty one OK um yeah according to the latest records uh provided by doctor's office you're now on a different drug metformin would you like us to go ahead and fill that prescription for you for pick up a bit of form in five hundred milligrams uh you're very welcome mary please let us know if there's anything else we can do for you today.<br>---<br>How was the response of the Customer Support agent. Classify and list down their various behaviors and cite the reason behind the classification, using the format BEHAVIOR("reason")|1. Empathetic("understands the customer's frustration")<br>2. Patient("happy to check that for you one moment please")<br>3. Knowledgeable("sometimes there's a gap in the system and it just doesn't get reported")<br>4. Helpful("happy to check that for you")<br>5. Accommodating("would you like us to go ahead and fill that prescription for you")<br>6. Courteous("you're very welcome mary")|

|Example details| Prompt | Completion|
|---------------|-------|------------|
|Example of prompt directing model response to fit a defined structure:|Output format:<br>{<br>"TOPIC_NAME": "",<br>"HEADLINES": [],<br>"REASON": ""<br>}<br>Input news headlines:<br>1. "From books to presentations in 10s with AR + ML"<br>2. "Demo from 1993 of 32-year-old Yann LeCun showing off the World's first Convolutional Network for Text Recognition"<br>3. "First Order Motion Model applied to animate paintings"<br>4. "Robinhood and other brokers literally blocking purchase of $GME, $NOK, $BB, $AMC; allow sells"<br>5. "United Airlines stock down over 5% premarket trading"<br>6. "Bitcoin was nearly $20,000 a year ago today"<br><br>Output:|{"TOPIC_NAME": "Artificial Intelligence and Machine Learning",<br>"HEADLINES": ["From books to presentations in 10s with AR + ML",<br>"Demo from 1993 of 32-year-old Yann LeCun showing off the World's first Convolutional Network for Text Recognition", "First Order Motion Model applied to animate paintings"],"REASONING": "These headlines all contain references to Artificial Intelligence and Machine Learning, such as AR, ML, Convolutional Network, and First Order Motion Model." }<br>{"TOPIC_NAME": "Stock Market",<br>"HEADLINES": ["Robinhood and other brokers literally blocking purchase of $GME, $NOK, $BB, $AMC; allow sells", "United Airlines stock down over 5% premarket trading", "Bitcoin was nearly $20,000 a year ago today"],<br>"REASONING": "These headlines all contain references to the stock market, such as Robinhood, United Airlines, and Bitcoin." }|

## Adjusting Temperature and Top_P parameters

Changing the temperature parameter allows models to have differing risk levels. A higher value, for example 0.7 will make the output more random and produce more divergent responses. While a lower value, like 0.2 will make the output more focused and concrete. For example, a fictional story could be generated using a higher temperature. Whereas to generate a legal document it's recommended to use a much lower temperature.

In the next example we test two model responses at different temperature settings of 0.1 and 0.9 respectively. While the evaluation of creative content such as the pieces of text below is a subjective exercise and opinions may vary, the difference in model response to the same prompt solely from changing the temperature parameter is apparent.

|Instruction Type| Prompt | Completion|
|----------------|--------|-----------|
| Model response for temperature setting 0.1:| Write a product launch email for new AI-powered headphones that are priced at $79.99 and available at Best Buy, Target and Amazon.com. The target audience is tech-savvy music lovers and the tone is friendly and exciting.<br>1. What should be the subject line of the email?<br>2. What should be the body of the email?|Subject Line: Introducing the AI-Powered Headphones You've Been Waiting For!<br><br>Dear Tech-Savvy Music Lovers,<br><br>-We are thrilled to announce the launch of our new AI-powered headphones! These headphones are designed to provide you with the ultimate listening experience, with features like noise cancellation, adjustable sound settings, and more.<br><br>Our AI-powered headphones are now available at Best Buy, Target, and Amazon.com for just $79.99. With this unbeatable price, you can enjoy the highest quality sound without breaking the bank.<br><br>Our AI-powered headphones are perfect for anyone who loves music. Whether you're a professional musician or just a casual listener, you'll appreciate the superior sound quality and convenience of these headphones.<br><br>We know you'll love our AI-powered headphones, so don't wait - get yours today!<br><br>Sincerely,<br>[Your Company Name]|  
|Model response for temperature setting 0.9:| Write a product launch email for new AI-powered headphones that are priced at $79.99 and available at Best Buy, Target and Amazon.com. The target audience is tech-savvy music lovers and the tone is friendly and exciting.<br><br>1. What should be the subject line of the email?<br>2. What should be the body of the email?| Subject Line: Upgrade your Music Listening Experience with AI-powered Headphones<br><br>Greetings Tech-savvy Music Lovers!<br><br>We have some exciting news to share with you – the newest AI-powered headphones are here! Our newest headphones feature advanced AI technology to give you the best sound that you’ve ever heard. They come with a crystal-clear sound, deep bass response and are designed to make your music listening experience enjoyable, no matter what type of music you listen to.<br><br>What’s more, they are now available at Best Buy, Target and Amazon.com for just $79.99, so you can enjoy the highest sound quality without breaking the bank.<br><br>But that’s not all! Our headphones are also packed with several other amazing features such as noise-cancellation technology and a hands-free microphone for calls, making them truly unbeatable.<br><br>So why wait? Upgrade your music listening experience and enjoy the best sound your ears have ever heard. Our AI-powered headphones are now available at Best Buy, Target and Amazon.com, so get yours today!<br><br>We hope you will enjoy these headphones as much as we do.<br><br>Happy Listening!<br><br>The AI-powered Headphones Team|

Top_probability is another parameter and is similar to temperature in that it also controls the randomness of the model response, but it does so in a different way. Experiment with different model responses by varying temperature and Top_P, but not both at once.





 
































## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* Get started with the ChatGPT model with [the ChatGPT quickstart](../chatgpt-quickstart.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)
