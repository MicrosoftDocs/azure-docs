## Overview

Conversational Language Understanding allows you to add prebuilt components to entities. Prebuilt components automatically predict common types from utterances. Learn more about components [here](./concepts/entity-components.md).

## Reference

The following prebuilt components are available in CLU.

| **Type** | **Description** | **Examples** | **Supported Languages** |
| --- | --- | --- | --- |
| Media.Artist | Celebrity music artists | Adele,  Phil Collins | English, Chinese |
| Media.Title | Song names | Lose Yourself, Someone Like You | English, Chinese |
| Media.Genre | Music genres | Jazz, Pop, Rock | English, Chinese |
| Person.Name | A person&#39;s partial or full name | John, Mary | English, Chinese |
| Car.Part | Parts of a vehicle | Headlights, Side mirror | English, Chinese |
| Geography.Location | Geographical locations or places of interest | London, McDonalds | English, Chinese |
| Quantity.Age | Age of a person or thing | 30 years old, 9 months old | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Number | A cardinal number in numeric or text form | Thirty, 23, 14.5, Two and a half | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Percentage | A percentage,  using the symbol % or the word &#39;percent&#39; | 10%5.6 percent | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Ordinal | An ordinal number in numeric or text form | first, second, last, 10th | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Dimension | Special dimensions such as length,  distance,  volume,  area,  and speed. | two miles, 650 square kilometers, 35 km/h | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Temperature | A temperature in Celsius or Fahrenheit | 32F,  34 degrees celsius, 2 deg C | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Quantity.Currency | Monetary amounts including currency | 1000.00 US dollars, £20.00,  $67.5B | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Datetime | Dates and times | June 23, 1976, 7 AM, 6:49 PM, Tomorrow at 7 PM, Next Week | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Email | Email Addresses | [user@example.com](mailto:user@example.com), [user\_name@example.net](mailto:user_name@example.net), [user.name@example.com](mailto:user.name@example.com) | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| Phone Number | US Phone Numbers | 123-456-7890,  +1 123 456 789,  (123)456-789 | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |
| URL | Website URLs and Links | www.example.com,  http://example.net?name=my\_name&amp;age=10,  https://www.example.net/page | English, Chinese, French, Italian, German, Brazilian Portuguese, Spanish |

## Prebuilt components in multilingual projects

In multilingual conversation projects,  you can enable any of the prebuilt components. The component will only be predicted if the language of the query is supported by the prebuilt. The language is either specified in the request or defaults to the primary language of the application if not provided.
