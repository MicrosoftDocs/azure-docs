---
title: Pricing for virtual machine offers | Microsoft Docs
description: Explains the three methods of specifying the pricing of virtual machine offers.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---


Pricing for virtual machine offers
==================================

There are three ways to specify pricing for virtual machine offers: customized core pricing, per-core pricing, and spreadsheet pricing.


Customized core pricing
-----------------------

Pricing is specific for each region and core combination. Every region in the sell list must be specified in the
**virtualMachinePricing**/**regionPrices** section of the definition.  Use the correct currency codes for each [region](#regions) in
your request.  The following example demonstrates these requirements:

``` json
    "virtualMachinePricing": 
    {
        ... 
        "coreMultiplier": 
        {
            "currency": "USD",
                "individually": 
                {
                    "sharedcore": 2,
                    "1core": 2,
                    "2core": 3,
                    "4core": 4,
                    "6core": 5,
                    "8core": 2,
                    "12core": 4,
                    "16core": 4,
                    "20core": 4,
                    "24core": 4,
                    "32core": 4,
                    "36core": 4,
                    "40core": 4,
                    "64core": 4,
                    "128core": 4
                }
        }
        ...
     }
```


Per-core pricing
----------------

In this case, the publishers specify one price in USD for their SKU and
all other prices are automatically generated. The price per core is
specified in the **single** parameter in the request.

``` json
     "virtualMachinePricing": 
     {
         ...
         "coreMultiplier": 
         {
             "currency": "USD",
             "single": 1.0
         }
     }
```


Spreadsheet pricing
-------------------

The publisher may also upload their pricing spreadsheet to a temporary
storage location, then include the URI in the request like other file
artifacts. The spreadsheet is then uploaded, translated to evaluate the 
specified price schedule, and finally updates the offer with the pricing
information. Subsequent GET requests for the offer will return the
spreadsheet URI and the evaluated prices for the region.

``` json
     "virtualMachinePricing": 
     {
         ...
         "spreadSheetPricing": 
         {
             "uri": "https://blob.storage.azure.com/<your_spreadsheet_location_here>/prices.xlsx",
         }
     }
```

Regions
-------

The following table shows the different regions that you can specify for
customized core pricing, and their corresponding currency codes.

| **Region** | **Name**             | **Currency code** |
|------------|----------------------|-------------------|
| DZ         | Algeria              | DZD               |
| AR         | Argentina            | ARS               |
| AU         | Australia            | AUD               |
| AT         | Austria              | EUR               |
| BH         | Bahrain              | BHD               |
| BY         | Belarus              | RUB               |
| BE         | Belgium              | EUR               |
| BR         | Brazil               | USD               |
| BG         | Bulgaria             | BGN               |
| CA         | Canada               | CAD               |
| CL         | Chile                | CLP               |
| CO         | Colombia             | COP               |
| CR         | Costa Rica           | CRC               |
| HR         | Croatia              | HRK               |
| CY         | Cyprus               | EUR               |
| CZ         | Czech Republic       | CZK               |
| DK         | Denmark              | DKK               |
| DO         | Dominican Republic   | USD               |
| EC         | Ecuador              | USD               |
| EG         | Egypt                | EGP               |
| SV         | El Salvador          | USD               |
| EE         | Estonia              | EUR               |
| FI         | Finland              | EUR               |
| FR         | France               | EUR               |
| DE         | Germany              | EUR               |
| GR         | Greece               | EUR               |
| GT         | Guatemala            | GTQ               |
| HK         | Hong Kong SAR        | HKD               |
| HU         | Hungary              | HUF               |
| IS         | Iceland              | ISK               |
| IN         | India                | INR               |
| ID         | Indonesia            | IDR               |
| IE         | Ireland              | EUR               |
| IL         | Israel               | ILS               |
| IT         | Italy                | EUR               |
| JP         | Japan                | JPY               |
| JO         | Jordan               | JOD               |
| KZ         | Kazakhstan           | KZT               |
| KE         | Kenya                | KES               |
| KR         | Korea                | KRW               |
| KW         | Kuwait               | KWD               |
| LV         | Latvia               | EUR               |
| LI         | Liechtenstein        | CHF               |
| LT         | Lithuania            | EUR               |
| LU         | Luxembourg           | EUR               |
| MK         | Macedonia FYRO       | MKD               |
| MY         | Malaysia             | MYR               |
| MT         | Malta                | EUR               |
| MX         | Mexico               | MXN               |
| ME         | Montenegro           | EUR               |
| MA         | Morocco              | MAD               |
| NL         | Netherlands          | EUR               |
| NZ         | New Zealand          | NZD               |
| NG         | Nigeria              | NGN               |
| NO         | Norway               | NOK               |
| OM         | Oman                 | OMR               |
| PK         | Pakistan             | PKR               |
| PA         | Panama               | USD               |
| PY         | Paraguay             | PYG               |
| PE         | Peru                 | PEN               |
| PH         | Philippines          | PHP               |
| PL         | Poland               | PLN               |
| PT         | Portugal             | EUR               |
| PR         | Puerto Rico          | USD               |
| QA         | Qatar                | QAR               |
| RO         | Romania              | RON               |
| RU         | Russia               | RUB               |
| SA         | Saudi Arabia         | SAR               |
| RS         | Serbia               | RSD               |
| SG         | Singapore            | SGD               |
| SK         | Slovakia             | EUR               |
| SI         | Slovenia             | EUR               |
| ZA         | South Africa         | ZAR               |
| ES         | Spain                | EUR               |
| LK         | Sri Lanka            | USD               |
| SE         | Sweden               | SEK               |
| CH         | Switzerland          | CHF               |
| TW         | Taiwan               | TWD               |
| TH         | Thailand             | THB               |
| TT         | Trinidad and Tobago  | TTD               |
| TN         | Tunisia              | TND               |
| TR         | Turkey               | TRY               |
| UA         | Ukraine              | UAH               |
| AE         | United Arab Emirates | EUR               |
| GB         | United Kingdom       | GBP               |
| US         | United States        | USD               |
| UY         | Uruguay              | UYU               |
| VE         | Venezuela            | USD               |
|  |  |  |
