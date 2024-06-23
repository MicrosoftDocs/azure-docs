---
author: eric-urban
ms.service: azure-ai-speech
ms.date: 09/29/2022
ms.topic: include
ms.author: eur
---

The console output shows the full conversation and summary. Here's an example of the overall summary, with redactions for brevity:

```output
Conversation summary:
    issue: Customer wants to sign up for insurance.
    resolution: Customer was advised that customer would be contacted by the insurance company.
```

If you specify the `--output FILE` optional [argument](../../../call-center-quickstart.md#usage-and-arguments), a JSON version of the results are written to the file. The file output is a combination of the JSON responses from the [batch transcription](../../../batch-transcription.md) (Speech), [sentiment](../../../../language-service/sentiment-opinion-mining/overview.md) (Language), and [conversation summarization](../../../../language-service/summarization/overview.md?tabs=conversation-summarization) (Language) APIs. 

The `transcription` property contains a JSON object with the results of sentiment analysis merged with batch transcription. Here's an example, with redactions for brevity:
```json
{
    "source": "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav",
// Example results redacted for brevity
        "nBest": [
          {
            "confidence": 0.77464247,
            "lexical": "hello thank you for calling contoso who am i speaking with today",
            "itn": "hello thank you for calling contoso who am i speaking with today",
            "maskedITN": "hello thank you for calling contoso who am i speaking with today",
            "display": "Hello, thank you for calling Contoso. Who am I speaking with today?",
            "sentiment": {
              "positive": 0.78,
              "neutral": 0.21,
              "negative": 0.01
            }
          },
        ]
// Example results redacted for brevity
}   
```

The `conversationAnalyticsResults` property contains a JSON object with the results of the conversation PII and conversation summarization analysis. Here's an example, with redactions for brevity:
```json
{
  "conversationAnalyticsResults": {
    "conversationSummaryResults": {
      "conversations": [
        {
          "id": "conversation1",
          "summaries": [
            {
              "aspect": "issue",
              "text": "Customer wants to sign up for insurance"
            },
            {
              "aspect": "resolution",
              "text": "Customer was advised that customer would be contacted by the insurance company"
            }
          ],
          "warnings": []
        }
      ],
      "errors": [],
      "modelVersion": "2022-05-15-preview"
    },
    "conversationPiiResults": {
      "combinedRedactedContent": [
        {
          "channel": "0",
          "display": "Hello, thank you for calling Contoso. Who am I speaking with today? Hi, ****. Uh, are you calling because you need health insurance?", // Example results redacted for brevity
          "itn": "hello thank you for calling contoso who am i speaking with today hi **** uh are you calling because you need health insurance", // Example results redacted for brevity
          "lexical": "hello thank you for calling contoso who am i speaking with today hi **** uh are you calling because you need health insurance" // Example results redacted for brevity
        },
        {
          "channel": "1",
          "display": "Hi, my name is **********. I'm trying to enroll myself with Contoso. Yes. Yeah, I'm calling to sign up for insurance.", // Example results redacted for brevity
          "itn": "hi my name is ********** i'm trying to enroll myself with contoso yes yeah i'm calling to sign up for insurance", // Example results redacted for brevity
          "lexical": "hi my name is ********** i'm trying to enroll myself with contoso yes yeah i'm calling to sign up for insurance" // Example results redacted for brevity
        }
      ],
      "conversations": [
        {
          "id": "conversation1",
          "conversationItems": [
            {
              "id": "0",
              "redactedContent": {
                "itn": "hello thank you for calling contoso who am i speaking with today",
                "lexical": "hello thank you for calling contoso who am i speaking with today",
                "text": "Hello, thank you for calling Contoso. Who am I speaking with today?"
              },
              "entities": [],
              "channel": "0",
              "offset": "PT0.77S"
            },
            {
              "id": "1",
              "redactedContent": {
                "itn": "hi my name is ********** i'm trying to enroll myself with contoso",
                "lexical": "hi my name is ********** i'm trying to enroll myself with contoso",
                "text": "Hi, my name is **********. I'm trying to enroll myself with Contoso."
              },
              "entities": [
                {
                  "text": "Mary Rondo",
                  "category": "Name",
                  "offset": 15,
                  "length": 10,
                  "confidenceScore": 0.97
                }
              ],
              "channel": "1",
              "offset": "PT4.55S"
            },
            {
              "id": "2",
              "redactedContent": {
                "itn": "hi **** uh are you calling because you need health insurance",
                "lexical": "hi **** uh are you calling because you need health insurance",
                "text": "Hi, ****. Uh, are you calling because you need health insurance?"
              },
              "entities": [
                {
                  "text": "Mary",
                  "category": "Name",
                  "offset": 4,
                  "length": 4,
                  "confidenceScore": 0.93
                }
              ],
              "channel": "0",
              "offset": "PT9.55S"
            },
            {
              "id": "3",
              "redactedContent": {
                "itn": "yes yeah i'm calling to sign up for insurance",
                "lexical": "yes yeah i'm calling to sign up for insurance",
                "text": "Yes. Yeah, I'm calling to sign up for insurance."
              },
              "entities": [],
              "channel": "1",
              "offset": "PT13.09S"
            },
// Example results redacted for brevity
          ],
          "warnings": []
        }
      ]
    }
  }
}
```
