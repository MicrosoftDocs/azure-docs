---
title: Data alteration - LUIS
description: Learn how data can be changed before predictions in Language Understanding (LUIS)
ms.topic: conceptual
ms.date: 05/06/2020
---

# Alter utterance data before or during prediction
LUIS provides ways to manipulate the utterance before or during the prediction. These include [fixing spelling](luis-tutorial-bing-spellcheck.md), and fixing timezone issues for prebuilt [datetimeV2](luis-reference-prebuilt-datetimev2.md).

## Correct spelling errors in utterance


### V3 runtime

Preprocess text for spelling corrections before you send the utterance to LUIS. Use example utterances with the correct spelling to ensure you get the correct predictions.

Use [Bing Spell Check](../bing-spell-check/overview.md) to correct text before sending it to LUIS.

### Prior to V3 runtime

LUIS uses [Bing Spell Check API V7](../Bing-Spell-Check/overview.md) to correct spelling errors in the utterance. LUIS needs the key associated with that service. Create the key, then add the key as a querystring parameter at the [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356).

The endpoint requires two params for spelling corrections to work:

|Param|Value|
|--|--|
|`spellCheck`|boolean|
|`bing-spell-check-subscription-key`|[Bing Spell Check API V7](https://azure.microsoft.com/services/cognitive-services/spell-check/) endpoint key|

When [Bing Spell Check API V7](https://azure.microsoft.com/services/cognitive-services/spell-check/) detects an error, the original utterance, and the corrected utterance are returned along with predictions from the endpoint.

#### [V2 prediction endpoint response](#tab/V2)

```JSON
{
  "query": "Book a flite to London?",
  "alteredQuery": "Book a flight to London?",
  "topScoringIntent": {
    "intent": "BookFlight",
    "score": 0.780123
  },
  "entities": []
}
```

#### [V3 prediction endpoint response](#tab/V3)

```JSON
{
    "query": "Book a flite to London?",
    "prediction": {
        "normalizedQuery": "book a flight to london?",
        "topIntent": "BookFlight",
        "intents": {
            "BookFlight": {
                "score": 0.780123
            }
        },
        "entities": {},
    }
}
```

* * *

### List of allowed words
The Bing spell check API used in LUIS does not support a list of words to ignore during the spell check alterations. If you need to allow a list of words or acronyms, process the utterance in the client application before sending the utterance to LUIS for intent prediction.

## Change time zone of prebuilt datetimeV2 entity
When a LUIS app uses the prebuilt [datetimeV2](luis-reference-prebuilt-datetimev2.md) entity, a datetime value can be returned in the prediction response. The timezone of the request is used to determine the correct datetime to return. If the request is coming from a bot or another centralized application before getting to LUIS, correct the timezone LUIS uses.

### V3 prediction API to alter timezone

In V3, the `datetimeReference` determines the timezone offset. Learn more about [V3 predictions](luis-migration-api-v3.md#v3-post-body).

### V2 prediction API to alter timezone
The timezone is corrected by adding the user's timezone to the endpoint using the `timezoneOffset` parameter based on the API version. The value of the parameter should be the positive or negative number, in minutes, to alter the time.

#### V2 prediction daylight savings example
If you need the returned prebuilt datetimeV2 to adjust for daylight savings time, you should use the querystring parameter with a +/- value in minutes for the [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) query.

Add 60 minutes:

`https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/{appId}?q=Turn the lights on?timezoneOffset=60&verbose={boolean}&spellCheck={boolean}&staging={boolean}&bing-spell-check-subscription-key={string}&log={boolean}`

Remove 60 minutes:

`https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/{appId}?q=Turn the lights on?timezoneOffset=-60&verbose={boolean}&spellCheck={boolean}&staging={boolean}&bing-spell-check-subscription-key={string}&log={boolean}`

#### V2 prediction C# code determines correct value of parameter

The following C# code uses the [TimeZoneInfo](https://docs.microsoft.com/dotnet/api/system.timezoneinfo) class's [FindSystemTimeZoneById](https://docs.microsoft.com/dotnet/api/system.timezoneinfo.findsystemtimezonebyid#examples) method to determine the correct offset value based on system time:

```csharp
// Get CST zone id
TimeZoneInfo targetZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");

// Get local machine's value of Now
DateTime utcDatetime = DateTime.UtcNow;

// Get Central Standard Time value of Now
DateTime cstDatetime = TimeZoneInfo.ConvertTimeFromUtc(utcDatetime, targetZone);

// Find timezoneOffset/datetimeReference
int offset = (int)((cstDatetime - utcDatetime).TotalMinutes);
```

## Next steps

> [!div class="nextstepaction"]
> [Correct spelling mistakes with this tutorial](luis-tutorial-bing-spellcheck.md)
