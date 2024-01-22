---
title: Supported prebuilt entity components
titleSuffix: Azure AI services
description: Learn about which entities can be detected automatically in Conversational Language Understanding
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Supported prebuilt entity components

Conversational Language Understanding allows you to add prebuilt components to entities. Prebuilt components automatically predict common types from utterances. See the [entity components](concepts/entity-components.md) article for information on components.

## Reference

The following prebuilt components are available in Conversational Language Understanding.

| Type | Description | Supported languages |
| --- | --- | --- |
| Quantity.Age | Age of a person or thing. For example: "30 years old", "9 months old" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Number | A cardinal number in numeric or text form. For example: "Thirty", "23", "14.5", "Two and a half" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Percentage | A percentage using the symbol % or the word "percent". For example: "10%", "5.6 percent" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Ordinal | An ordinal number in numeric or text form. For example: "first", "second", "last", "10th" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Dimension | Special dimensions such as length,  distance,  volume,  area,  and speed. For example: "two miles", "650 square kilometers", "35 km/h" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Temperature | A temperature in Celsius or Fahrenheit. For example: "32F",  "34 degrees celsius", "2 deg C" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Currency | Monetary amounts including currency. For example "1000.00 US dollars", "£20.00",  "$67.5B" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.NumberRange | A numeric interval. For example: "between 25 and 35" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Datetime | Dates and times. For example: "June 23, 1976", "7 AM", "6:49 PM", "Tomorrow at 7 PM", "Next Week" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Person.Name | The name of an individual. For example: "Joe", "Ann" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Email | Email Addresses. For example: "user@contoso.com", "user_name@contoso.com", "user.name@contoso.com" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Phone Number | US Phone Numbers. For example: "123-456-7890",  "+1 123 456 7890",  "(123)456-7890" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| URL | Website URLs and Links. | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| General.Organization | Companies and corporations. For example: "Microsoft" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Geography.Location | The name of a location. For example: "Tokyo" |  English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| IP Address | An IP address. For example: "192.168.0.4" | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |


## Prebuilt components in multilingual projects

In multilingual conversation projects,  you can enable any of the prebuilt components. The component is only predicted if the language of the query is supported by the prebuilt entity. The language is either specified in the request or defaults to the primary language of the application if not provided.

## Next steps

[Entity components](concepts/entity-components.md) 

