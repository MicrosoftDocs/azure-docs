---
title: Get ready for the next enhancement in Microsoft Purview
description: A new experience is coming to Microsoft Purview. This article provides the steps you need to take to try it out!
author: tomilolaabiodun
ms.author: toabiodu
ms.service: purview
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: references_regions
---

# Get ready for the next enhancement in Microsoft Purview

>[!NOTE]
>This new experience will be available within the next few weeks. Account owners and root collection admins will receive an email when it has been made available for your organization.

You spoke, we listened! Get ready for your next Microsoft Purview enhancement. We're rolling this new experience out to our customers to try. When it's available for your organization, your account owners and root collection admins will receive an email, and can follow these steps to enable the new experience!

The new experience is an enhancement to the current Microsoft Purview, and doesn't impact your information already stored in Microsoft Purview or your ability to use our APIs.

## How can you use our new experience?

The new experience is automatically available once your organization has been enabled, but getting started with it depends on your organization's current structure.
Follow one of these guides below:

- [You only have one Microsoft Purview account](#one-microsoft-purview-account)
  - [Your account region maps to your tenant region](#your-region-maps-to-an-available-region)
  - [Your account region doesn't match your tenant region](#your-region-doesnt-map-to-an-available-region)
- [You have multiple Microsoft Purview accounts](#multiple-microsoft-purview-accounts)

### One Microsoft Purview account

#### Your region maps to an available region

If your Microsoft Purview account's region matches with a currently available region, you're automatically able to use the new experience! No upgrade required.

To access it, you can either:

- Select the note at the top of the Microsoft Purview accounts page.
- Select the toggle in the Microsoft Purview governance portal.

    :::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch to the new experience.":::

#### Your region doesn't map to an available region

1. Have an account owner or root collection admin select the **Upgrade** button in the Azure portal, Microsoft Purview portal, or upgrade email.

1. If your account is in a different region than your tenant, an admin needs to confirm set up.

    :::image type="content" source="./media/account-upgrades/different-region.png" alt-text="Screenshot showing the different region confirmation pop-up window.":::

    >[!NOTE]
    >If you want to use a different region, you will either need to cancel and wait for upcoming region related features, or cancel and create a new Microsoft Purview account in one of the [available regions](#regions).
1. After confirmation, the new portal will launch.
1. You can take the tour and begin exploring the new Microsoft Purview experience!

>[!TIP]
>You can switch between the classic and new experiences using the toggle at the top of the portal.
>
>:::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch between the new and classic experiences after upgrading.":::

### Multiple Microsoft Purview accounts

1. Have an account owner or root collection admin select the **Upgrade** button in the Azure portal, Microsoft Purview portal, or upgrade email.
1. The new experience requires a tenant-level/organization-wide account that is the primary account for your organization. Select an existing account to upgrade it to be your organization-wide account.
    >[!NOTE]
    >This does not affect your other Microsoft Purview accounts, or their data. In the future, their information will also be made available in the primary account.

    :::image type="content" source="./media/account-upgrades/selected-account.png" alt-text="Screenshot of the pop up window for selecting an organization wide primary account.":::

1. If the account you select is in a different region than your tenant, an admin needs to confirm set up.

    :::image type="content" source="./media/account-upgrades/selected-account-different-region.png" alt-text="Screenshot of confirmation for selecting an account in a region that's different from your tenant region.":::

    >[!NOTE]
    >If you want to use a different [region](#regions), you will either need to cancel and select or create a different Microsoft Purview account, or cancel and wait for upcoming region related features.
1. After confirmation, the new portal will launch.
1. You can take the tour and begin exploring the new Microsoft Purview experience!

>[!TIP]
>You can switch between the classic and new experiences using the toggle at the top of the portal.
>
> :::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch between the new and classic experiences.":::

## Regions

For information regarding all available Microsoft Purview regions, see [the Azure product by regions page.](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=purview&regions=all)

These are the regions that are currently available for the new experience:

| Purview Account Location | Mapped Azure AD Country or Region                           | Tenant Location Code |
| ------------------------ | ----------------------------------------------------------- | -------------------- |
| Australia East           |  Australia                                                  | AU                   |
|                          |  Fiji                                                       | FJ                   |
|                          |  New Zealand                                                | NZ                   |
| Brazil South             |  Argentina                                                  | AR                   |
|                          |  Bolivia (Plurinational State of)                           | BO                   |
|                          |  Bonaire Sint Eustatius and Saba                            | BQ                   |
|                          |  Brazil                                                     | BR                   |
|                          |  Chile                                                      | CL                   |
|                          |  Colombia                                                   | CO                   |
|                          |  Curaçao                                                    | CW                   |
|                          |  Ecuador                                                    | EC                   |
|                          |  Falkland Islands (the)                                     | FK                   |
|                          |  French Guiana                                              | GF                   |
|                          |  Guyana                                                     | GY                   |
|                          |  Peru                                                       | PE                   |
|                          |  Paraguay                                                   | PY                   |
|                          |  Suri                                                       | SR                   |
|                          |  Sint Maarten (Dutch part)                                  | SX                   |
|                          |  Uruguay                                                    | UY                   |
|                          |  Venezuela (Bolivarian Republic of)                         | VE                   |
| Canada Central           | Canada                                                      | CA                   |
| Central India            |  India                                                      | IN                   |
|                          |  Sri Lanka                                                  | LK                   |
|                          |  Nepal                                                      | NP                   |
| Central US               |  United States of America (the)                             | US                   |
| East US                  | Antigua and Barbuda                                         | AG                   |
|                          |  Anguilla                                                   | AI                   |
|                          |  Aruba                                                      | AW                   |
|                          |  Barbados                                                   | BB                   |
|                          |  Bermuda                                                    | BM                   |
|                          |  Bahamas (the)                                              | BS                   |
|                          |  Cuba                                                       | CU                   |
|                          |  Dominica                                                   | DM                   |
|                          |  Dominican Republic (the)                                   | DO                   |
|                          |  Grenada                                                    | GD                   |
|                          |  Guadeloupe                                                 | GP                   |
|                          |  Haiti                                                      | HT                   |
|                          |  Jamaica                                                    | JM                   |
|                          |  Saint Kitts and Nevis                                      | KN                   |
|                          |  Cayman Islands (the)                                       | KY                   |
|                          |  Saint Lucia                                                | LC                   |
|                          |  Martinique                                                 | MQ                   |
|                          |  Panama                                                     | PA                   |
|                          |  Puerto Rico                                                | PR                   |
|                          |  Trinidad and Tobago                                        | TT                   |
|                          |  Saint Vincent and the Grenadines                           | VC                   |
|                          |  Virgin Islands (British)                                   | VG                   |
|                          |  Virgin Islands (U.S.)                                      | VI                   |
|                          |  United States of America (the)                             | US                   |
| East US 2                |  United States of America (the)                             | US                   |
| France Central           | France                                                      | FR                   |
| Germany West Central     | Germany                                                     | DE                   |
| Japan East               | Japan                                                       | JP                   |
| Korea Central            |  Korea (the Republic of)                                    | KR                   |
| North Europe             |  Finland                                                    | FI                   |
|                          |  Faroe Islands (the)                                        | FO                   |
|                          |  Ireland                                                    | IE                   |
|                          |  Iceland                                                    | IS                   |
|                          |  Moldova (the Republic of)                                  | MD                   |
|                          |  Sweden                                                     | SE                   |
| Qatar Central            | Qatar                                                       | QA                   |
| South Africa North       |  Angola                                                     | AO                   |
|                          |  Burkina Faso                                               | BF                   |
|                          |  Burundi                                                    | BI                   |
|                          |  Benin                                                      | BJ                   |
|                          |  Botswana                                                   | BW                   |
|                          |  Congo (the Democratic Republic of the)                     | CD                   |
|                          |  Central African Republic (the)                             | CF                   |
|                          |  Congo (the)                                                | CG                   |
|                          |  Côte d'Ivoire                                              | CI                   |
|                          |  Cameroon                                                   | CM                   |
|                          |  Cabo Verde                                                 | CV                   |
|                          |  Djibouti                                                   | DJ                   |
|                          |  Algeria                                                    | DZ                   |
|                          |  Egypt                                                      | EG                   |
|                          |  Eritrea                                                    | ER                   |
|                          |  Ethiopia                                                   | ET                   |
|                          |  Gabon                                                      | GA                   |
|                          |  Ghana                                                      | GH                   |
|                          |  Gambia (the)                                               | GM                   |
|                          |  Guinea                                                     | GN                   |
|                          |  Equatorial Guinea                                          | GQ                   |
|                          |  Guinea-Bissau                                              | GW                   |
|                          |  Kenya                                                      | KE                   |
|                          |  Comoros (the)                                              | KM                   |
|                          |  Liberia                                                    | LR                   |
|                          |  Lesotho                                                    | LS                   |
|                          |  Libya                                                      | LY                   |
|                          |  Morocco                                                    | MA                   |
|                          |  Madagascar                                                 | MG                   |
|                          |  Mali                                                       | ML                   |
|                          |  Mauritania                                                 | MR                   |
|                          |  Mauritius                                                  | MU                   |
|                          |  Malawi                                                     | MW                   |
|                          |  Mozambique                                                 | MZ                   |
|                          |  Namibia                                                    | NA                   |
|                          |  Niger (the)                                                | NE                   |
|                          |  Nigeria                                                    | NG                   |
|                          |  Réunion                                                    | RE                   |
|                          |  Rwanda                                                     | RW                   |
|                          |  Seychelles                                                 | SC                   |
|                          |  Sudan (the)                                                | SD                   |
|                          |  Saint Helena Ascension and Tristan da Cunha                | SH                   |
|                          |  Sierra Leone                                               | SL                   |
|                          |  Senegal                                                    | SN                   |
|                          |  Somalia                                                    | SO                   |
|                          |  South Sudan                                                | SS                   |
|                          |  São Tomé and Príncipe                                      | ST                   |
|                          |  Eswatini                                                   | SZ                   |
|                          |  Chad                                                       | TD                   |
|                          |  Togo                                                       | TG                   |
|                          |  Tunisia                                                    | TN                   |
|                          |  Tanzania United Republic of                                | TZ                   |
|                          |  Uganda                                                     | UG                   |
|                          |  Mayotte                                                    | YT                   |
|                          |  South Africa                                               | ZA                   |
|                          |  Zambia                                                     | ZM                   |
|                          |  Zimbabwe                                                   | ZW                   |
| Southeast Asia           |  Armenia                                                    | AM                   |
|                          |  American Samoa                                             | AS                   |
|                          |  Brunei Darussalam                                          | BN                   |
|                          |  Cocos (Keeling) Islands (the)                              | CC                   |
|                          |  Cook Islands (the)                                         | CK                   |
|                          |  China                                                      | CN                   |
|                          |  Christmas Island                                           | CX                   |
|                          |  Micronesia (Federated States of)                           | FM                   |
|                          |  Guam                                                       | GU                   |
|                          |  Hong Kong SAR                                              | HK                   |
|                          |  Indonesia                                                  | ID                   |
|                          |  Cambodia                                                   | KH                   |
|                          |  Kiribati                                                   | KI                   |
|                          |  Lao People's Democratic Republic (the)                     | LA                   |
|                          |  Marshall Islands (the)                                     | MH                   |
|                          |  Myanmar                                                    | MM                   |
|                          |  Macao SAR                                                  | MO                   |
|                          |  Northern Mariana Islands (the)                             | MP                   |
|                          |  Malaysia                                                   | MY                   |
|                          |  New Caledonia                                              | NC                   |
|                          |  Norfolk Island                                             | NF                   |
|                          |  Nauru                                                      | NR                   |
|                          |  Niue                                                       | NU                   |
|                          |  French Polynesia                                           | PF                   |
|                          |  Papua New Guinea                                           | PG                   |
|                          |  Philippines (the)                                          | PH                   |
|                          |  Pitcairn                                                   | PN                   |
|                          |  Palau                                                      | PW                   |
|                          |  Solomon Islands                                            | SB                   |
|                          |  Singapore                                                  | SG                   |
|                          |  Thailand                                                   | TH                   |
|                          |  Tokelau                                                    | TK                   |
|                          |  Tonga                                                      | TO                   |
|                          |  Tuvalu                                                     | TV                   |
|                          |  Taiwan (Province of China)                                 | TW                   |
|                          |  United States Minor Outlying Islands (the)                 | UM                   |
|                          |  Viet Nam                                                   | VN                   |
|                          |  Vanuatu                                                    | VU                   |
|                          |  Wallis and Futuna                                          | WF                   |
|                          |  Samoa                                                      | WS                   |
| South Central US         |  United States of America (the)                             | US                   |
| Switzerland North        | Switzerland                                                 | CH                   |
| UAE North                | United Arab Emirates (the)                                  | AE                   |
| UK South                 |  United Kingdom of Great Britain and Northern Ireland (the) | GB                   |
| West Central US          |  United States of America (the)                             | US                   |
| West Europe              |  Andorra                                                    | AD                   |
|                          |  Albania                                                    | AL                   |
|                          |  Austria                                                    | AT                   |
|                          |  Åland Islands                                              | AX                   |
|                          |  Azerbaijan                                                 | AZ                   |
|                          |  Bosnia and Herzegovina                                     | BA                   |
|                          |  Belgium                                                    | BE                   |
|                          |  Bulgaria                                                   | BG                   |
|                          |  Bahrain                                                    | BH                   |
|                          |  Belarus                                                    | BY                   |
|                          |  Cyprus                                                     | CY                   |
|                          |  Czechia                                                    | CZ                   |
|                          |  Denmark                                                    | DK                   |
|                          |  Estonia                                                    | EE                   |
|                          |  Spain                                                      | ES                   |
|                          |  Georgia                                                    | GE                   |
|                          |  Guernsey                                                   | GG                   |
|                          |  Gibraltar                                                  | GI                   |
|                          |  Greece                                                     | GR                   |
|                          |  Croatia                                                    | HR                   |
|                          |  Hungary                                                    | HU                   |
|                          |  Israel                                                     | IL                   |
|                          |  Isle of Man                                                | IM                   |
|                          |  Italy                                                      | IT                   |
|                          |  Jersey                                                     | JE                   |
|                          |  Jordan                                                     | JO                   |
|                          |  Kuwait                                                     | KW                   |
|                          |  Kazakhstan                                                 | KZ                   |
|                          |  Lebanon                                                    | LB                   |
|                          |  Liechtenstein                                              | LI                   |
|                          |  Lithuania                                                  | LT                   |
|                          |  Luxembourg                                                 | LU                   |
|                          |  Latvia                                                     | LV                   |
|                          |  Monaco                                                     | MC                   |
|                          |  Montenegro                                                 | ME                   |
|                          |  Republic of North Macedonia                                | MK                   |
|                          |  Malta                                                      | MT                   |
|                          |  Netherlands (the)                                          | NL                   |
|                          |  Norway                                                     | NO                   |
|                          |  Oman                                                       | OM                   |
|                          |  Pakistan                                                   | PK                   |
|                          |  Poland                                                     | PL                   |
|                          |  Portugal                                                   | PT                   |
|                          |  Romania                                                    | RO                   |
|                          |  Serbia                                                     | RS                   |
|                          |  Russian Federation (the)                                   | RU                   |
|                          |  Saudi Arabia                                               | SA                   |
|                          |  Slovenia                                                   | SI                   |
|                          |  Svalbard and Jan Mayen                                     | SJ                   |
|                          |  Slovakia                                                   | SK                   |
|                          |  San Marino                                                 | SM                   |
|                          |  Türkiye                                                    | TR                   |
|                          |  Ukraine                                                    | UA                   |
|                          |  Holy See (the)                                             | VA                   |
|                          |  Yemen                                                      | YE                   |
| West US                  |  United States of America (the)                             | US                   |
| West US 2                |  United States of America (the)                             | US                   |
| West US 3                |  Costa Rica                                                 | CR                   |
|                          |  Guatemala                                                  | GT                   |
|                          |  Honduras                                                   | HN                   |
|                          |  Mexico                                                     | MX                   |
|                          |  Nicaragua                                                  | NI                   |
|                          |  El Salvador                                                | SV                   |
|                          |  New Mexico                                                 | NM                   |
|                          |  United States of America (the)                             | US                   |

## Next steps

Stay tuned for updates! Until then, make use of Microsoft Purview's other features:

- [Create an account](create-microsoft-purview-portal.md)
- [Share and receive data](quickstart-data-share.md)
- [Data lineage](concept-data-lineage.md)
- [Data owner policies](concept-policies-data-owner.md)
- [Classification](concept-classification.md)
