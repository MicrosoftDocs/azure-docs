---
title: 'How to prepare a dataset for custom model training'
titleSuffix: Azure OpenAI Service
description: Learn how to prepare your dataset for fine-tuning
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 06/24/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
keywords: 

---
# Learn how to prepare your dataset for fine-tuning

The first step of customizing your model is to prepare a high quality dataset. To do this you'll need a set of training examples composed of single input prompts and the associated desired output ('completion'). This format is notably different than using models during inference in the following ways:

- Only provide a single prompt vs a few examples.
- You don't need to provide detailed instructions as part of the prompt.
- Each prompt should end with a fixed separator to inform the model when the prompt ends and the completion begins. A simple separator, which generally works well is `\n\n###\n\n`. The separator shouldn't appear elsewhere in any prompt.
- Each completion should start with a whitespace due to our tokenization, which tokenizes most words with a preceding whitespace.
- Each completion should end with a fixed stop sequence to inform the model when the completion ends. A stop sequence could be `\n`, `###`, or any other token that doesn't appear in any completion.
- For inference, you should format your prompts in the same way as you did when creating the training dataset, including the same separator. Also specify the same stop sequence to properly truncate the completion.
- The dataset cannot exceed 100 MB in total file size.

## Best practices

Customization performs better with high-quality examples and the more you have, generally the better the model performs. We recommend that you provide at least a few hundred high-quality examples to achieve a model that performs better than using well-designed prompts with a base model. From there, performance tends to linearly increase with every doubling of the number of examples. Increasing the number of examples is usually the best and most reliable way of improving performance.

If you're fine-tuning on a pre-existing dataset rather than writing prompts from scratch, be sure to manually review your data for offensive or inaccurate content if possible, or review as many random samples of the dataset as possible if it's large.

## Specific guidelines

Fine-tuning can solve various problems, and the optimal way to use it may depend on your specific use case. Below, we've listed the most common use cases for fine-tuning and corresponding guidelines.

### Classification

Classifiers are the easiest models to get started with. For classification problems we suggest using **ada**, which generally tends to perform only very slightly worse than more capable models once fine-tuned, while being significantly faster. In classification problems, each prompt in the dataset should be classified into one of the predefined classes. For this type of problem, we recommend:

- Use a separator at the end of the prompt, for example, `\n\n###\n\n`. Remember to also append this separator when you eventually make requests to your model.
- Choose classes that map to a single token. At inference time, specify max_tokens=1 since you only need the first token for classification.
- Ensure that the prompt + completion doesn't exceed 2048 tokens, including the separator
- Aim for at least 100 examples per class
- To get class log probabilities, you can specify logprobs=5 (for five classes) when using your model
- Ensure that the dataset used for fine-tuning is very similar in structure and type of task as what the model will be used for

#### Case study: Is the model making untrue statements?

Let's say you'd like to ensure that the text of the ads on your website mentions the correct product and company. In other words, you want to ensure the model isn't making things up. You may want to fine-tune a classifier which filters out incorrect ads.

The dataset might look something like the following:

```json
{"prompt":"Company: BHFF insurance\nProduct: allround insurance\nAd:One stop shop for all your insurance needs!\nSupported:", "completion":" yes"}
{"prompt":"Company: Loft conversion specialists\nProduct: -\nAd:Straight teeth in weeks!\nSupported:", "completion":" no"}
```

In the example above, we used a structured input containing the name of the company, the product, and the associated ad. As a separator we used `\nSupported:` which clearly separated the prompt from the completion. With a sufficient number of examples, the separator you choose doesn't make much of a difference (usually less than 0.4%) as long as it doesn't appear within the prompt or the completion.

For this use case we fine-tuned an ada model since it is faster and cheaper, and the performance is comparable to larger models because it's a classification task.

Now we can query our model by making a Completion request.

```console
curl https://YOUR_RESOURCE_NAME.openaiazure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2023-05-15\ \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{
  "prompt": "Company: Reliable accountants Ltd\nProduct: Personal Tax help\nAd:Best advice in town!\nSupported:",
  "max_tokens": 1
 }'
```

Which will return either `yes` or `no`.

#### Case study: Sentiment analysis

Let's say you'd like to get a degree to which a particular tweet is positive or negative. The dataset might look something like the following:

```console
{"prompt":"Overjoyed with the new iPhone! ->", "completion":" positive"}
{"prompt":"@contoso_basketball disappoint for a third straight night. ->", "completion":" negative"}
```

Once the model is fine-tuned, you can get back the log probabilities for the first completion token by setting `logprobs=2` on the completion request. The higher the probability for positive class, the higher the relative sentiment.

Now we can query our model by making a Completion request.

```console
curl https://YOUR_RESOURCE_NAME.openaiazure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2023-05-15\ \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{
  "prompt": "Excited to share my latest blog post! ->",
  "max_tokens": 1,
  "logprobs": 2
 }'
```

Which will return:

```json
{
  "object": "text_completion",
  "created": 1589498378,
  "model": "YOUR_FINE_TUNED_MODEL_NAME",
  "choices": [
    {
      "logprobs": {
        "text_offset": [
          19
        ],
        "token_logprobs": [
          -0.03597255
        ],
        "tokens": [
          " positive"
        ],
        "top_logprobs": [
          {
            " negative": -4.9785037,
            " positive": -0.03597255
          }
        ]
      },

      "text": " positive",
      "index": 0,
      "finish_reason": "length"
    }
  ]
}
```

#### Case study: Categorization for Email triage

Let's say you'd like to categorize incoming email into one of a large number of predefined categories. For classification into a large number of categories, we recommend you convert those categories into numbers, which will work well with up to approximately 500 categories. We've observed that adding a space before the number sometimes slightly helps the performance, due to tokenization. You may want to structure your training data as follows:

```json
{
    "prompt":"Subject: <email_subject>\nFrom:<customer_name>\nDate:<date>\nContent:<email_body>\n\n###\n\n", "completion":" <numerical_category>"
}
```

For example:

```json
{
    "prompt":"Subject: Update my address\nFrom:Joe Doe\nTo:support@ourcompany.com\nDate:2021-06-03\nContent:Hi,\nI would like to update my billing address to match my delivery address.\n\nPlease let me know once done.\n\nThanks,\nJoe\n\n###\n\n", 
    "completion":" 4"
}
```

In the example above we used an incoming email capped at 2043 tokens as input. (This allows for a four token separator and a one token completion, summing up to 2048.) As a separator we used `\n\n###\n\n` and we removed any occurrence of ### within the email.

### Conditional generation

Conditional generation is a problem where the content needs to be generated given some kind of input. This includes paraphrasing, summarizing, entity extraction, product description writing given specifications, chatbots and many others. For this type of problem we recommend:

- Use a separator at the end of the prompt, for example, `\n\n###\n\n`. Remember to also append this separator when you eventually make requests to your model.
- Use an ending token at the end of the completion, for example, `END`.
- Remember to add the ending token as a stop sequence during inference, for example, `stop=[" END"]`.
- Aim for at least ~500 examples.
- Ensure that the prompt + completion doesn't exceed 2048 tokens, including the separator.
- Ensure the examples are of high quality and follow the same desired format.
- Ensure that the dataset used for fine-tuning is similar in structure and type of task as what the model will be used for.
- Using Lower learning rate and only 1-2 epochs tends to work better for these use cases.

#### Case study: Write an engaging ad based on a Wikipedia article

This is a generative use case so you would want to ensure that the samples you provide are of the highest quality, as the fine-tuned model will try to imitate the style (and mistakes) of the given examples. A good starting point is around 500 examples. A sample dataset might look like this:

```json
{
    "prompt":"<Product Name>\n<Wikipedia description>\n\n###\n\n", 
    "completion":" <engaging ad> END"
}
```

For example:

```json
{
    "prompt":"Samsung Galaxy Feel\nThe Samsung Galaxy Feel is an Android smartphone developed by Samsung Electronics exclusively for the Japanese market. The phone was released in June 2017 and was sold by NTT Docomo. It runs on Android 7.0 (Nougat), has a 4.7 inch display, and a 3000 mAh battery.\nSoftware\nSamsung Galaxy Feel runs on Android 7.0 (Nougat), but can be later updated to Android 8.0 (Oreo).\nHardware\nSamsung Galaxy Feel has a 4.7 inch Super AMOLED HD display, 16 MP back facing and 5 MP front facing cameras. It has a 3000 mAh battery, a 1.6 GHz Octa-Core ARM Cortex-A53 CPU, and an ARM Mali-T830 MP1 700 MHz GPU. It comes with 32GB of internal storage, expandable to 256GB via microSD. Aside from its software and hardware specifications, Samsung also introduced a unique a hole in the phone's shell to accommodate the Japanese perceived penchant for personalizing their mobile phones. The Galaxy Feel's battery was also touted as a major selling point since the market favors handsets with longer battery life. The device is also waterproof and supports 1seg digital broadcasts using an antenna that is sold separately.\n\n###\n\n", 
    "completion":"Looking for a smartphone that can do it all? Look no further than Samsung Galaxy Feel! With a slim and sleek design, our latest smartphone features high-quality picture and video capabilities, as well as an award winning battery life. END"
}
```

Here we used a multiline separator, as Wikipedia articles contain multiple paragraphs and headings. We also used a simple end token, to ensure that the model knows when the completion should finish.

#### Case study: Entity extraction

This is similar to a language transformation task. To improve the performance, it's best to either sort different extracted entities alphabetically or in the same order as they appear in the original text. This helps the model to keep track of all the entities which need to be generated in order. The dataset could look as follows:

```json
{
    "prompt":"<any text, for example news article>\n\n###\n\n", 
    "completion":" <list of entities, separated by a newline> END"
}
```

For example:

```json
{
    "prompt":"Portugal will be removed from the UK's green travel list from Tuesday, amid rising coronavirus cases and concern over a \"Nepal mutation of the so-called Indian variant\". It will join the amber list, meaning holidaymakers should not visit and returnees must isolate for 10 days...\n\n###\n\n", 
    "completion":" Portugal\nUK\nNepal mutation\nIndian variant END"
}
```

A multi-line separator works best, as the text will likely contain multiple lines. Ideally there will be a high diversity of the types of input prompts (news articles, Wikipedia pages, tweets, legal documents), which reflect the likely texts which will be encountered when extracting entities.

#### Case study: Customer support chatbot

A chatbot will normally contain relevant context about the conversation (order details), summary of the conversation so far, and most recent messages. For this use case the same past conversation can generate multiple rows in the dataset, each time with a slightly different context, for every agent generation as a completion. This use case requires a few thousand examples, as it likely deals with different types of requests, and customer issues. To ensure the performance is of high quality, we recommend vetting the conversation samples to ensure the quality of agent messages. The summary can be generated with a separate text transformation fine tuned model. The dataset could look as follows:

```json
{"prompt":"Summary: <summary of the interaction so far>\n\nSpecific information:<for example order details in natural language>\n\n###\n\nCustomer: <message1>\nAgent: <response1>\nCustomer: <message2>\nAgent:", "completion":" <response2>\n"}
{"prompt":"Summary: <summary of the interaction so far>\n\nSpecific information:<for example order details in natural language>\n\n###\n\nCustomer: <message1>\nAgent: <response1>\nCustomer: <message2>\nAgent: <response2>\nCustomer: <message3>\nAgent:", "completion":" <response3>\n"}
```

Here we purposefully separated different types of input information, but maintained Customer Agent dialog in the same format between a prompt and a completion. All the completions should only be by the agent, and we can use `\n` as a stop sequence when doing inference.

#### Case study: Product description based on a technical list of properties

Here it's important to convert the input data into a natural language, which will likely lead to superior performance. For example, the following format:

```json
{
    "prompt":"Item=handbag, Color=army_green, price=$99, size=S->", 
    "completion":"This stylish small green handbag will add a unique touch to your look, without costing you a fortune."
}
```

Won't work as well as:

```json
{
    "prompt":"Item is a handbag. Colour is army green. Price is midrange. Size is small.->",
    "completion":"This stylish small green handbag will add a unique touch to your look, without costing you a fortune."
}
```

For high performance, ensure that the completions were based on the description provided. If external content is often consulted, then adding such content in an automated way would improve the performance. If the description is based on images, it may help to use an algorithm to extract a textual description of the image. Since completions are only one sentence long, we can use `.` as the stop sequence during inference.

### Open ended generation

For this type of problem we recommend:

- Leave the prompt empty.
- No need for any separators.
- You'll normally want a large number of examples, at least a few thousand.
- Ensure the examples cover the intended domain or the desired tone of voice.

#### Case study: Maintaining company voice

Many companies have a large amount of high quality content generated in a specific voice. Ideally all generations from our API should follow that voice for the different use cases. Here we can use the trick of leaving the prompt empty, and feeding in all the documents which are good examples of the company voice. A fine-tuned model can be used to solve many different use cases with similar prompts to the ones used for base models, but the outputs are going to follow the company voice much more closely than previously.

```json
{"prompt":"", "completion":" <company voice textual content>"}
{"prompt":"", "completion":" <company voice textual content2>"}
```

A similar technique could be used for creating a virtual character with a particular personality, style of speech and topics the character talks about.

Generative tasks have a potential to leak training data when requesting completions from the model, so extra care needs to be taken that this is addressed appropriately. For example personal or sensitive company information should be replaced by generic information or not be included into fine-tuning in the first place.

## Next steps

* Fine tune your model with our [How-to guide](fine-tuning.md)
* Learn more about the [underlying models that power Azure OpenAI Service](../concepts/models.md)
