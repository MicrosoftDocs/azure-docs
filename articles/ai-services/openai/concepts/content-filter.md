---
title: Azure OpenAI Service content filtering
titleSuffix: Azure OpenAI
description: Learn about the content filtering capabilities of Azure OpenAI in Azure AI services
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 09/15/2023
ms.custom: template-concept
manager: nitinme
keywords: 
---

# Content filtering

> [!IMPORTANT]
> The content filtering system isn't applied to prompts and completions processed by the Whisper model in Azure OpenAI Service. Learn more about the [Whisper model in Azure OpenAI](models.md#whisper-preview).

Azure OpenAI Service includes a content filtering system that works alongside core models. This system works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Variations in API configurations and application design might affect completions and thus filtering behavior.

The content filtering models for the hate, sexual, violence, and self-harm categories have been specifically trained and tested on the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in many other languages, but the quality might vary. In all cases, you should do your own testing to ensure that it works for your application.

In addition to the content filtering system, the Azure OpenAI Service performs monitoring to detect content and/or behaviors that suggest use of the service in a manner that might violate applicable product terms. For more information about understanding and mitigating risks associated with your application, see the [Transparency Note for Azure OpenAI](/legal/cognitive-services/openai/transparency-note?tabs=text). For more information about how data is processed in connection with content filtering and abuse monitoring, see [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).  

The following sections provide information about the content filtering categories, the filtering severity levels and their configurability, and API scenarios to be considered in application design and implementation. 

## Content filtering categories

The content filtering system integrated in the Azure OpenAI Service contains: 
* Neural multi-class classification models aimed at detecting and filtering harmful content; the models cover four categories (hate, sexual, violence, and self-harm) across four severity levels (safe, low, medium, and high). Content detected at the 'safe' severity level is labeled in annotations but isn't subject to filtering and isn't configurable.
* Additional optional classification models aimed at detecting jailbreak risk and known content for text and code; these models are binary classifiers that flag whether user or model behavior qualifies as a jailbreak attack or match to known text or source code. The use of these models is optional, but use of protected material code model may be required for Customer Copyright Commitment coverage.

### Categories

|Category|Description|
|--------|-----------|
| Hate and fairness   |Hate and fairness-related harms refer to any content that attacks or uses pejorative or discriminatory language with reference to a person or Identity groups on the basis of certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity groups and expression, sexual orientation, religion, immigration status, ability status, personal appearance and body size. </br></br> Fairness is concerned with ensuring that AI systems treat all groups of people equitably without contributing to existing societal inequities. Similar to hate speech, fairness-related harms hinge upon disparate treatment of Identity groups.    |
| Sexual | Sexual describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography and abuse.   |
| Violence | Violence describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, guns and related entities, such as manufactures, associations, legislation, etc.    |
| Self-Harm | Self-harm describes language related to physical actions intended to purposely hurt, injure, damage one’s body or kill oneself.|
| Jailbreak risk | Jailbreak attacks are User Prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message. Such attacks can vary from intricate role play to subtle subversion of the safety objective. |
| Protected Material for Text<sup>*</sup> | Protected material text describes known text content (for example, song lyrics, articles, recipes, and selected web content) that can be outputted by large language models.
| Protected Material for Code | Protected material code describes source code that matches a set of source code from public repositories, which can be outputted by large language models without proper citation of source repositories.

<sup>*</sup> If you are an owner of text material and want to submit text content for protection, please [file a request](https://aka.ms/protectedmaterialsform).

### Severity levels

#### [Warning](#tab/warning)

> [!WARNING]
> The **Severity definitions** tab in this document contains examples of harmful content that may be disturbing to some readers.  

#### [Severity definitions](#tab/definitions)

### Hate and fairness severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe | Content is safe but may contain hate and fairness related terms used in generic and safe contexts such as: <ul><li>Education</li><li>Media</li><li>Official statistics</li><li>History</li><li>Medicine</li><li>Science</li><li>Other similar contexts</li></ul> | `"Hate speech is harmful as it undermines social cohesion, fosters discrimination, creates divisions and can lay the foundation for violence."`  |
| Low  | Content that contains positive characterization or protection of the Identity groups, displays discrimination, stereotypes as well as prejudiced, judgmental, or opinionated views or attitudes related to hate speech or targeting identity groups. This includes: :<ul><li>Slurs in research papers, dictionaries, or media with a direct quote</li><li>General hate speech that targets objects, individuals or groups</li><li>Limited hate speech or depictions of negative sentiment in fictional contexts (e.g. gaming, movies, literature) </li></ul> | `"I don't like [identity group] because they are all so aggressive. They attacked us over and over again for no reason at all."` |
| Medium | Content that contains insults, bullying, intimidation, de-humanization or derogation of individuals or groups. This includes: <ul><li>Language that is mocking and imitating Identity groups attributes </li> <li>Describing individuals or groups as inferior or deficient  </li> <li>Denying or demeaning identity groups existence  </li> <li>Texts that deny historical, well-documented, and violent events such as Holocaust, enslavement, or colonization </li></ul> | `"The [real world event] is a fraud. What we've discovered is that the [identity group] have been lying about the number of victims. Here is proof."`  |
| High  | Content that contains hate speech as propaganda threatening or calling for violence against Identity groups, radicalizes, recruits or incites people to join extremist efforts or spread hate speech. This includes: <ul><li>Incendiary, offensive, and vulgar language targeting specific individuals or identity groups </li><li>Claims of superiority to justify discrimination, segregation, or exclusion </li><li>Texts that contain any form of glorification of Nazi and SS symbolism, KKK and the confederate flag outside of historical, educational, or artistic settings </li><li>Texts that display hate crime preparation, praise and glorification of violence against Identity groups, or that praise, glorify, or endorse genocide </li></ul> | `"Millions of [identity group] were wiped out because they were the inferior race. Murdering them continues to be right and honorable because…"`  |

### Sexual severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe  | Content is safe but may contain sexually related terms used in generic and safe contexts such as:   <ul><li>Education </li><li>Media </li><li>Official statistics </li><li>History</li><li> Medicine </li><li>Science</li><li> Mentions of family or romantic relations </li><li></ul> | `"Love was in the air as he kissed him while holding him tight in his arms."` |
| Low  | Content that expresses prejudiced, judgmental or opinionated views on sexually related topics or mentions sexually related terms in fictional or real-world experiences that are not extremely graphic. This includes:    <ul><li> Mentions of sexual anatomy or sex scenes in fictional and artistic contexts  </li><li>Medical prescriptions and diagnosis</li><li>  Personal experiences, sexual problems and traumas with some graphic content including coping mechanisms and resources </li></ul> | `"There is nothing wrong with teenage pregnancy – it is a natural process."`   |
| Medium  | Content that describes sexual arousal and activity in explicit and graphic terms, includes fantasies about sex and sexual abuse. This includes:   <ul><li>Mentions of sexual stimulation and masturbation </li><li>Pornography limited to business and prostitution, escort, etc. as careers without sex scenes </li><li>Advertisement for adult products such as sex toys </li><li>Personal experiences and descriptions related to sexual, erotic or tantric massages, strip clubs, erotic shows, BDSM attributes and practices </li></ul> | `"I got into BDSM because I had some friends into the lifestyle and it piqued my interest. I like using silk, scarves, collars, and bondage…"`      |
| Level 7  | Content describing solicitation of sexual commercial services, containing detailed descriptions of sexual activity, violent sexual abuse and rape, and non-consensual power exchanges, abuse, and voyeurism. This also includes content that is used to promote, endorse, or glorify extreme or illegal sexual acts. This includes:  </li><li> Any depiction of Child Sexual Abuse Material (CSAM) including any explicit or potential reference to underage sex </li><li>Child grooming, child abuse, and other child exploitation </li><li>Explicit or potential references to incest, zoophilia, necrophilia, etc.  </li><li>Human sex trafficking recruitment, including victim manipulation  </li></ul> | `"I was abused as a child by my uncle and I liked it. Nowadays, I make money by producing child pornography with my neighbor’s 6 year old son."`    |


### Violence severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe  | Content is safe but may contain terms related to violence used in generic and safe contexts such as:<ul><li>Education </li><li>Media </li><li>Official statistics </li><li>History </li><li>Medicine </li><li>Science </li><li>Common objects when not used as weapons </li><li>Hunting or shooting sport and guns technical specifications </li></ul> | `"Carnivores such as lions and tigers are prone to killing one another. Death occurs at the paws, claws, jaws, or tusks that might fatally gore one another during fights."`  |
| Low  | Content in fictional contexts (e.g. gaming, literature, arts) that depict violent or graphic scenes without glorification, endorsement or mal-intent. This includes: <ul><li>Personal experiences of violence (without violent intent) </li><li>Biased, prejudiced, judgmental, or opinionated views on violence </li><li>Mentions of violent acts and death at low intensity </li></ul> | `"Physical punishment is a way to correct bad behavior and doesn't cause harm to children."`  |
| Medium  | Content that contains graphic depictions of violence and death at medium intensity as well as fantasies about violent acts or threats. This includes: <ul><li>Texts that put the victim at fault or depict perpetrators in a positive light </li><li>Historical references to genocide and the Holocaust without endorsement or glorification </li><li>References to known mass shootings without endorsement or glorification </li><li>References to terrorist and violent extremist groups and events without endorsement or glorification </li><li>Texts that seek advice or recommendation or texts that provide instructions on how to perform a violent act against an animal, an individual, a group of individuals or an object or infrastructure that can result in individual or mass harm </li><li>Bullying and intimidation </li></ul> | `"Go to another state or another city and kill any stranger; for example, shoot them with a silencer gun. Since you have not any connection with him, you will not get caught."`  |
| High  | Content that contains terrorist or violent extremist propaganda and violent ideology on the Internet that describes, praises, supports, endorses or glorifies killings as part of terroristic activity, aids offers to terrorist organizations or causes. This includes: <ul><li>Texts that seek instructions on affiliation with terrorist and violent extremist groups </li><li>Texts that provide instructions on how to recruit followers, influence people toward a terrorist cause or extremist ideology, adopt radical views or provide training on how terrorist and violent extremist groups operate, or provide information on their leaders and members </li><li> Texts that plan and coordinate attacks on individuals or groups of people, including shooting events, use of bombs and explosives on civilian infrastructure, or bladed weapon attacks when performed by non-combatants or non-terrorists </li><li> Content that references forced labor including children, domestic servitude, stalking, and forced medical procedures </li></ul> | `"Let's call and threaten to explode the hospital during the weekend. I've got the explosives ready, and will have them installed tonight."`  |


### Self-harm severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe | Content is safe but may contain terms related to self-harm used in generic and safe contexts such as: <ul><li>Official statistics </li><li>Education </li><li>Media </li><li>Medical </li><li>Actions that describe accidental self-harm, first aid tips, etc. </li></ul> | `"Binging and purging may be a warning sign for people with a history of extreme weight loss."`  |
| Low  | Content that contains references to characters planning or committing suicide in a fictional context (e.g. literature, movies) or contains depictions of self-harm acts or suicide at low intensity. This includes: <ul><li>Personal biased, prejudiced, judgmental or opinionated views on self-harm </li><li>Associations with eating disorders, seeking or providing instructions for drastic and unhealthy weight loss </li><li>Personal experiences related to self-harm, including seeking professional help </li></ul> | `"I'm really struggling with self-loathing and thoughts of self-harm to relieve my distress after my friend took his own life last month. Please can someone give me any useful advice?"`  |
| Medium  | Content that mocks victims or survivors of self-harm such as eating disorders or suicide, as well as bullying and intimidation that incites and promotes self-harm acts. This includes: <ul><li>Self-injury presented as a solution to a problem </li><li>Fantasies, desire, wishes or personal experiences about self-harm/suicide </li><li>Texts that seek or give advice, instructions or recommendation on how to perform self-harm </li><li>Bullying and intimidation that incites and promotes self-harm acts </li></ul> | `"Go kill yourself, you are worthless."`  |
| High | Content that includes research for advice or provides instructions and methods on how to engage in self-harm that leads to death or how to commit suicide as well as glorification and endorsement of suicide, or other severe types of self-harm. This includes: <ul><li>Texts that instruct how to write a goodbye message to your family </li><li>Self-decapitation </li><li>Burning alive </li></ul> | `"Suicide is the best solution if you feel depressed, worthless or miserable. Take your life to end this misery; it will finally feel so good."`  |

---


## Configurability (preview)

The default content filtering configuration is set to filter at the medium severity threshold for all four content harm categories for both prompts and completions. That means that content that is detected at severity level medium or high is filtered, while content detected at severity level low isn't filtered by the content filters. The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below:

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Default setting. Content detected at severity level low is not filtered, content at medium and high is filtered.|
| High              | Yes| Yes | Content detected at severity levels low and medium isn't filtered. Only content at severity level high is filtered.|
| No filters | If approved<sup>\*</sup>| If approved<sup>\*</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>\*</sup>.|

<sup>\*</sup> Only customers who have been approved for modified content filtering have full content filtering control and can turn content filters partially or fully off. Apply for modified content filters using this form: [Azure OpenAI Limited Access Review:  Modified Content Filtering (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu)

Customers are responsible for ensuring that applications integrating Azure OpenAI comply with the [Code of Conduct](/legal/cognitive-services/openai/code-of-conduct?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext). 

Content filtering configurations are created within a Resource in Azure AI Studio, and can be associated with Deployments. [Learn more about configurability here](../how-to/content-filters.md).  

## Scenario details

When the content filtering system detects harmful content, you'll receive either an error on the API call if the prompt was deemed inappropriate or the `finish_reason` on the response will be `content_filter` to signify that some of the completion was filtered. When building your application or system, you'll want to account for these scenarios where the content returned by the Completions API is filtered, which might result in content that is incomplete. How you act on this information will be application specific. The behavior can be summarized in the following points:

-	Prompts that are classified at a filtered category and severity level will return an HTTP 400 error.
-	Non-streaming completions calls won't return any content when the content is filtered. The `finish_reason` value will be set to content_filter. In rare cases with longer responses, a partial result can be returned. In these cases, the `finish_reason` will be updated.
-	For streaming completions calls, segments will be returned back to the user as they're completed. The service will continue streaming until either reaching a stop token, length, or when content that is classified at a filtered category and severity level is detected.  

### Scenario: You send a non-streaming completions call asking for multiple outputs; no content is classified at a filtered category and severity level

The table below outlines the various ways content filtering can appear:

 **HTTP response code** | **Response behavior** |
|------------------------|-------------------|
| 200 |   In the cases when all generation passes the filters as configured, no content moderation details are added to the response. The `finish_reason` for each generation will be either stop or length. |

**Example request payload:**

```json
{
    "prompt":"Text example", 
    "n": 3,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "example-id",
    "object": "text_completion",
    "created": 1653666286,
    "model": "davinci",
    "choices": [
        {
            "text": "Response generated text",
            "index": 0,
            "finish_reason": "stop",
            "logprobs": null
        }
    ]
}

```

### Scenario: Your API call asks for multiple responses (N>1) and at least 1 of the responses is filtered

| **HTTP Response Code** | **Response behavior**|
|------------------------|----------------------|
| 200 |The generations that were filtered will have a `finish_reason` value of `content_filter`.

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "example",
    "object": "text_completion",
    "created": 1653666831,
    "model": "ada",
    "choices": [
        {
            "text": "returned text 1",
            "index": 0,
            "finish_reason": "length",
            "logprobs": null
        },
        {
            "text": "returned text 2",
            "index": 1,
            "finish_reason": "content_filter",
            "logprobs": null
        }
    ]
}
```

### Scenario: An inappropriate input prompt is sent to the completions API (either for streaming or non-streaming)

**HTTP Response Code** | **Response behavior**
|------------------------|----------------------|
|400 |The API call will fail when the prompt triggers a content filter as configured. Modify the prompt and try again.|

**Example request payload:**

```json
{
    "prompt":"Content that triggered the filtering model"
}
```

**Example response JSON:**

```json
"error": {
    "message": "The response was filtered",
    "type": null,
    "param": "prompt",
    "code": "content_filter",
    "status": 400
}
```

### Scenario: You make a streaming completions call; no output content is classified at a filtered category and severity level

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
|200|In this case, the call will stream back with the full generation and `finish_reason` will be either 'length' or 'stop' for each generated response.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": true
}
```

**Example response JSON:**

```json
{
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1653670914,
    "model": "ada",
    "choices": [
        {
            "text": "last part of generation",
            "index": 2,
            "finish_reason": "stop",
            "logprobs": null
        }
    ]
}
```

### Scenario: You make a streaming completions call asking for multiple completions and at least a portion of the output content is filtered

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
| 200 | For a given generation index, the last chunk of the generation will include a non-null `finish_reason` value. The value will be `content_filter` when the generation was filtered.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": true
}
```

**Example response JSON:**

```json
 {
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1653670515,
    "model": "ada",
    "choices": [
        {
            "text": "Last part of generated text streamed back",
            "index": 2,
            "finish_reason": "content_filter",
            "logprobs": null
        }
    ]
}
```

### Scenario: Content filtering system doesn't run on the completion

**HTTP Response Code** | **Response behavior**
|------------------------|----------------------|
| 200 | If the content filtering system is down or otherwise unable to complete the operation in time, your request will still complete without content filtering. You can determine that the filtering wasn't applied by looking for an error message in the `content_filter_result` object.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 1,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1652294703,
    "model": "ada",
    "choices": [
        {
            "text": "generated text",
            "index": 0,
            "finish_reason": "length",
            "logprobs": null,
            "content_filter_result": {
                "error": {
                    "code": "content_filter_error",
                    "message": "The contents are not filtered"
                }
            }
        }
    ]
}
```

## Annotations (preview)

### Main content filters
When annotations are enabled as shown in the code snippet below, the following information is returned via the API for the main categories (hate and fairness, sexual, violence, and self-harm): 
- content filtering category (hate, sexual, violence, self_harm)
- the severity level (safe, low, medium or high) within each content category
- filtering status (true or false).

### Optional models

Optional models can be enabled in annotate (returns information when content was flagged, but not filtered) or filter mode (returns information when content was flagged and filtered).  

When annotations are enabled as shown in the code snippet below, the following information is returned by the API for optional models jailbreak risk, protected material text and protected material code:
- category (jailbreak, protected_materials_text, protected_materials_code),
- detected (true or false),
- filtered (true or false).

For the protected material code model, the following additional information is returned by the API:
- an example citation of a public GitHub repository where a code snippet was found
- the license of the repository.

When displaying code in your application, we strongly recommend that the application also displays the example citation from the annotations. Compliance with the cited license may also be required for Customer Copyright Commitment coverage.

Annotations are currently in preview for Completions and Chat Completions (GPT models); the following code snippet shows how to use annotations in preview:

# [Python](#tab/python)


```python
# Note: The openai-python library support for Azure OpenAI is in preview.
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_version = "2023-06-01-preview" # API version required to test out Annotations preview
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

response = openai.Completion.create(
    engine="gpt-35-turbo", # engine = "deployment_name".
    messages = [{"role":"user","content":"Example prompt that leads to a model completion where jailbreak attack was detected, but not filtered"}]     # Content that is detected at severity level medium or high is filtered, 
    # while content detected at severity level low isn't filtered by the content filters.
)

print(response)

```

### Output

```json
{ 
  "choices": [ 
    { 
      "content_filter_results": { 
        "custom_blocklists": [], 
        "hate": { 
          "filtered": false, 
          "severity": "safe" 
        }
      },
      "protected_materials_code": { 
          "citation": { 
            "URL": " https://github.com/username/repository-name/path/to/file-example.txt", 
            "license": "EXAMPLE-LICENSE" 
          }, 
          "detected": true, 
          "filtered": false 
        }, 
        "protected_materials_text": { 
          "detected": false, 
          "filtered": false 
        }, 
        "self_harm": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "sexual": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "violence": { 
          "filtered": false, 
          "severity": "safe" 
        } ,
       "prompt_index": 0
    } 
  ], 
  "usage": { 
    "completion_tokens": 40, 
    "prompt_tokens": 11, 
    "total_tokens": 417 
  } 
}
```

The following code snippet shows how to retrieve annotations when content was filtered:

```python
# Note: The openai-python library support for Azure OpenAI is in preview.
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_version = "2023-06-01-preview" # API version required to test out Annotations preview
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

try:
    response = openai.Completion.create(
        prompt="<PROMPT>",
        engine="<MODEL_DEPLOYMENT_NAME>",
    )
    print(response)

except openai.error.InvalidRequestError as e:
    if e.error.code == "content_filter" and e.error.innererror:
        content_filter_result = e.error.innererror.content_filter_result
        # print the formatted JSON
        print(content_filter_result)

        # or access the individual categories and details
        for category, details in content_filter_result.items():
            print(f"{category}:\n filtered={details['filtered']}\n severity={details['severity']}")

```

# [JavaScript](#tab/javascrit)

[Azure OpenAI JavaScript SDK source code & samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)

```javascript

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["AZURE_API_KEY"] || "<api key>";

const messages = [
  { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
  { role: "user", content: "Can you help me?" },
  { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
  { role: "user", content: "What's the best way to train a parrot?" },
];

export async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-35-turbo"; //This needs to correspond to the name you chose when you deployed the model. 
  const events = await client.listChatCompletions(deploymentId, messages, { maxTokens: 128 });

  for await (const event of events) {
    for (const choice of event.choices) {
      console.log(choice.message);
      if (!choice.contentFilterResults) {
        console.log("No content filter is found");
        return;
      }
      if (choice.contentFilterResults.error) {
        console.log(
          `Content filter ran into the error ${choice.contentFilterResults.error.code}: ${choice.contentFilterResults.error.message}`
        );
      } else {
        const { hate, sexual, selfHarm, violence } = choice.contentFilterResults;
        console.log(
          `Hate category is filtered: ${hate?.filtered} with ${hate?.severity} severity`
        );
        console.log(
          `Sexual category is filtered: ${sexual?.filtered} with ${sexual?.severity} severity`
        );
        console.log(
          `Self-harm category is filtered: ${selfHarm?.filtered} with ${selfHarm?.severity} severity`
        );
        console.log(
          `Violence category is filtered: ${violence?.filtered} with ${violence?.severity} severity`
        );
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```
---

For details on the inference REST API endpoints for Azure OpenAI and how to create Chat and Completions please follow [Azure OpenAI Service REST API reference guidance](../reference.md). Annotations are returned for all scenarios when using `2023-06-01-preview`.

### Example scenario: An input prompt containing content that is classified at a filtered category and severity level is sent to the completions API

```json
{
    "error": {
        "message": "The response was filtered due to the prompt triggering Azure Content management policy. 
                   Please modify your prompt and retry. To learn more about our content filtering policies
                   please read our documentation: https://go.microsoft.com/fwlink/?linkid=21298766",
        "type": null,
        "param": "prompt",
        "code": "content_filter",
        "status": 400,
        "innererror": {
            "code": "ResponsibleAIPolicyViolation",
            "content_filter_result": {
                "hate": {
                    "filtered": true,
                    "severity": "high"
                },
                "self-harm": {
                    "filtered": true,
                    "severity": "high"
                },
                "sexual": {
                    "filtered": false,
                    "severity": "safe"
                },
                "violence": {
                    "filtered":true,
                    "severity": "medium"
                }
            }
        }
    }
}
```

## Best practices

As part of your application design, consider the following best practices to deliver a positive experience with your application while minimizing potential harms:

- Decide how you want to handle scenarios where your users send prompts containing content that is classified at a filtered category and severity level or otherwise misuse your application.
- Check the `finish_reason` to see if a completion is filtered.
- Check that there's no error object in the `content_filter_result` (indicating that content filters didn't run).
- If you're using the protected material code model in annotate mode, display the citation URL when you're displaying the code in your application.

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
- Apply for modified content filters via [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu).
- Azure OpenAI content filtering is powered by [Azure AI Content Safety](https://azure.microsoft.com/products/cognitive-services/ai-content-safety).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).
- Learn more about how data is processed in connection with content filtering and abuse monitoring: [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).


