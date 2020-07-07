---
title: Pricing for virtual machine offers - Azure Marketplace
description: Explains the three methods to specify the pricing of virtual machine offers.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/08/2020
ms.author: dsindona
---


Pricing for virtual machine offers
==================================

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues to work after the migration to Partner Center.

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
                    "sharedcore": 1,
                    "1core": 2,
                    "2core": 2,
                    "4core": 2,
                    "6core": 2,
                    "8core": 2,
                    "10core": 4,
                    "12core": 4,
                    "16core": 4,
                    "20core": 4,
                    "24core": 4,
                    "32core": 6,
                    "36core": 6,
                    "40core": 6,
                    "44core": 6,
                    "48core": 10,
                    "60core": 10,
                    "64core": 10,
                    "72core": 10,
                    "80core": 12,
                    "96core": 12,
                    "120core": 15,
                    "128core": 15,
                    "208core": 20,
                    "416core": 30
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

New core sizes added on 7/2/2019
---------------------------

VM publishers were notified on July 2, 2019 of the addition of new prices for new Azure virtual machine sizes (based on the number of cores).  The new prices are for the core sizes 10, 44, 48, 60, 120, 208, and 416.  For existing VM offers new prices for these cores sizes were automatically calculated based on current prices.  Publishers have until August 1, 2019 to review the additional prices and make any desired changes.  After this date, if not already re-published by the publisher, the automatically calculated prices for these new core sizes will take effect.


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
| MK         | North Macedonia      | MKD               |
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
