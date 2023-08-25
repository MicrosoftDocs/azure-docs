---
title: 'Tutorial: Configure Workday writeback in Azure Active Directory'
description: Learn how to configure attribute writeback from Azure AD to Workday
services: active-directory
author: cmmdesai
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.topic: tutorial
ms.workload: identity
ms.date: 11/21/2022
ms.author: chmutali
---
# Tutorial: Configure attribute writeback from Azure AD to Workday
The objective of this tutorial is to show the steps you need to perform to writeback attributes from Azure AD to Workday. The Workday writeback provisioning app supports assigning values to the following Workday attributes:
* Work Email 
* Workday username
* Work landline telephone number (including country code, area code, number and extension)
* Work landline telephone number primary flag
* Work mobile number (including country code, area code, number)
* Work mobile primary flag

## Overview

After you setup inbound provisioning integration using either [Workday to on-premises AD](workday-inbound-tutorial.md) provisioning app or [Workday to Azure AD](workday-inbound-cloud-only-tutorial.md) provisioning app, you can optionally configure the Workday Writeback app to write contact information such as work email and phone number to Workday. 

### Who is this user provisioning solution best suited for?

This Workday Writeback user provisioning solution is ideally suited for:

* Organizations using Microsoft 365 that desire to writeback authoritative attributes managed by IT (such as email address, username and phone number) back to Workday

## Configure integration system user in Workday

Refer to the section [configure integration system user](workday-inbound-tutorial.md#configure-integration-system-user-in-workday) for creating a Workday integration system user account with permissions to retrieve worker data. 

## Configuring Azure AD attribute writeback to Workday

Follow these instructions to configure writeback of user email addresses and username from Azure Active Directory to Workday.

* [Adding the Writeback connector app and creating the connection to Workday](#part-1-adding-the-writeback-connector-app-and-creating-the-connection-to-workday)
* [Configure writeback attribute mappings](#part-2-configure-writeback-attribute-mappings)
* [Enable and launch user provisioning](#enable-and-launch-user-provisioning)

### Part 1: Adding the Writeback connector app and creating the connection to Workday

**To configure Workday Writeback connector:**

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, search for and select **Azure Active Directory**.

3. Select **Enterprise Applications**, then **All Applications**.

4. Select **Add an application**, then select the **All** category.

5. Search for **Workday Writeback**, and add that app from the gallery.

6. After the app is added and the app details screen is shown, select **Provisioning**.

7. Change the **Provisioning** **Mode** to **Automatic**.

8. Complete the **Admin Credentials** section as follows:

   * **Admin Username** – Enter the username of the Workday integration system account, with the tenant domain name appended. Should look something like: *username\@contoso4*

   * **Admin password –** Enter the password of the Workday integration system account

   * **Tenant URL –** Enter the URL to the Workday web services endpoint for your tenant. This value should look like:
        `https://wd3-impl-services1.workday.com/ccx/service/contoso4/Human_Resources`,
        where *contoso4* is replaced with your correct tenant name and *wd3-impl* is replaced with the correct environment string (if necessary).

   * **Notification Email –** Enter your email address, and check the  "send email if failure occurs" checkbox.

   * Click the **Test Connection** button. If the connection test succeeds, click the **Save** button at the top. If it fails, double-check that the Workday URL and credentials are valid in Workday.

### Part 2: Configure writeback attribute mappings

In this section, you will configure how writeback attributes flow from Azure AD to Workday. 

1. On the Provisioning tab under **Mappings**, click on the mapping name.

2. In the **Source Object Scope** field, you can optionally filter, which sets of users in Azure Active Directory should be part of the writeback. The default scope is "all users in Azure AD".

3. In the **Attribute mappings** section, update the matching ID to indicate the attribute in Azure Active Directory where the Workday worker ID or employee ID is stored. A popular matching method is to synchronize the Workday worker ID or employee ID to extensionAttribute1-15 in Azure AD, and then use this attribute in Azure AD to match users back in Workday.

4. Typically you map the Azure AD *userPrincipalName* attribute to Workday *UserID* attribute and map the Azure AD *mail* attribute to the Workday *EmailAddress* attribute. 

     >[!div class="mx-imgBorder"]
     >![Azure portal](./media/workday-inbound-tutorial/workday-writeback-mapping.png)

5. Use the guidance shared below to map phone number attribute values from Azure AD to Workday. See [Writeback expression mapping examples](#writeback-expression-mapping-examples) to configure the right expression mapping for each attribute. 

     | Workday phone attribute | Expected value | Mapping guidance |
     |-------------------------|----------------|------------------|
     | WorkphoneLandlineIsPrimary | true/false | Constant or expression mapping whose output is "true" or "false" string value. |
     | WorkphoneLandlineCountryCodeName | [Three-letter ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) | Constant or expression mapping whose output is a three letter country code.  |
     | WorkphoneLandlineCountryCodeNumber | [International country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes) | Constant or expression mapping whose output is a valid country code (without the + sign).  |
     | WorkphoneLandlineNumber | Full phone number including the area code | Map to *telephoneNumber* attribute. Use regex to remove whitespace, brackets and country code.  |
     | WorkphoneLandlineExtension | Extension number | If *telephoneNumber* contains extension, use regex to extract the value. |
     | WorkphoneMobileIsPrimary | true/false | Constant mapping or expression mapping whose output is "true" or "false" string value |
     | WorkphoneMobileCountryCodeName | [Three-letter ISO 3166-1 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) | Constant or expression mapping whose output is a three letter country code. |
     | WorkphoneMobileCountryCodeNumber | [International country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes) | Constant or expression mapping whose output is a valid country code (without the + sign). |
     | WorkphoneMobileNumber | Full phone number including the area code | Map to *mobile* attribute. Use regex to remove whitespace, brackets and country code. |

     > [!NOTE]
     > When invoking the Change_Work_Contact Workday web service, Azure AD sends the following constant values: <br>
     > * **Communication_Usage_Type_ID** is set to the constant string "WORK" <br>
     > * **Phone_Device_Type_ID** is set to constant string "Mobile" for mobile phone numbers and "Landline" for landline phone numbers. <br>
     > 
     > You will encounter writeback failures if your Workday tenant uses different Type_IDs. To prevent such failures, you can use the Workday **Maintain Reference IDs** task and update the Type_IDs to match the values used by Azure AD. <br>
     >  

6. To save your mappings, click **Save** at the top of the Attribute-Mapping section.

## Writeback expression mapping examples
This section provides examples for configuring the Workday Writeback application for common integration scenarios. 

* [Timing the writeback for pre-hires](#timing-the-writeback-for-pre-hires)
* [Handling phone number with country code and phone number](#handling-phone-number-with-country-code-and-phone-number)
* [Derive country codes from Azure AD *usageLocation* attribute](#derive-country-codes-from-azure-ad-usagelocation-attribute)
* [Extracting a 10-digit phone number](#extracting-a-10-digit-phone-number)
* [Removing spaces, dashes and brackets in a phone number](#removing-spaces-dashes-and-brackets-in-a-phone-number)
* [Handling landline phone number extensions](#handling-landline-phone-number-extensions)

### Timing the writeback for pre-hires 

In a typical Workday integration with Azure AD, inbound user provisioning app - [Workday to on-premises Active Directory](workday-inbound-tutorial.md) or [Workday to Azure AD](workday-inbound-cloud-only-tutorial.md) - creates a new Azure AD account for pre-hires generating unique email and userPrincipalName for the user. 

By default, the Workday Writeback app will try to set the work email and userID values on the Workday account immediately after the user is created in Azure AD. 

If you want to delay the UserID or Email writeback so that it happens on or after hire date, follow the steps given below. 

  1) There is an attribute in Azure AD called *employeeHireDate* in which you can capture the user's employment start date.
  1) If you are using [Workday to on-premises Active Directory](workday-inbound-tutorial.md) provisioning job, configure it to flow the Workday *StatusHireDate* field to an attribute in on-premises Active Directory (e.g. *extensionAttribute8*). Configure AAD Connect to sync the on-premises value to *employeeHireDate* in Azure AD. 
  1) If you are using [Workday to Azure AD](workday-inbound-cloud-only-tutorial.md) provisioning job, configure it to flow the Workday *StatusHireDate* field directly to *employeeHireDate* attribute in Azure AD. 
      > [!NOTE]
      > If you are storing the employee start date in any other Azure AD *extensionAttribute*, you can use that attribute instead of *employeeHireDate* in the expression below.
  1) In your Workday Writeback application, use the following expression rule to export AAD userPrincipalName to Workday UserID field.
      ```C#
      IgnoreFlowIfNullOrEmpty(IIF(DateDiff("d", Now(), CDate([employeeHireDate])) >= 0, "", [userPrincipalName]))
      ```
      The expression above uses the [DateDiff](../app-provisioning/functions-for-customizing-application-data.md#datediff) function to evaluate the difference between *employeeHireDate* and today's date in UTC obtained using [Now](../app-provisioning/functions-for-customizing-application-data.md#now) function. If *employeeHireDate* is greater than or equal to today's date, then it updates the UserID. Else it returns an empty value and the [IgnoreFlowIfNullOrEmpty](../app-provisioning/functions-for-customizing-application-data.md#ignoreflowifnullorempty) function excludes this attribute from Writeback.

> [!IMPORTANT]
> For the delayed Writeback to work as expected, an operation in on-premises AD or Azure AD must trigger a change to the user just a day before the arrival or on the hire date, so that this user's profile is updated and is considered for Writeback. It must be a change, that updates an attribute value on the user profile, where the new attribute value is different from the old attribute value. 


### Handling phone number with country code and phone number
For the phone number writeback operation to be successful, it is important to send the right country code name and country code number. The country code name is a three-letter code that complies with [ISO 3166-1 format](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3), while country code number refers to the country calling code or [international subscriber dialing (ISD) code](https://en.wikipedia.org/wiki/List_of_country_calling_codes) for that country. 

This example assumes that the phone number value in Azure AD for *telephoneNumber* or *mobile* has the format `+<isdCode><space><phoneNumber>`. <br>
Example: If the phone number value is set to `+1 1112223333` or `+1 (111) 222-3333`, then `1` is the ISD Code and the country code name corresponding to it is `USA`.

Use the regular expression mappings below to send the right country code name and country code number to Workday. You can use either *telphoneNumber* or *mobile* as the source attribute. The examples below use *telephoneNumber*. All expressions here use the [Replace](../app-provisioning/functions-for-customizing-application-data.md#replace) function. 

**Example mapping for *WorkphoneLandlineNumber* or *WorkphoneMobileNumber***

```C#
Replace(Replace([telephoneNumber], , "\\+(?<isdCode>\\d* )(?<phoneNumber>.*)", , "${phoneNumber}", , ), ,"[()\\s-]+", ,"", , )
```

**Example mapping for *WorkphoneLandlineCountryCodeNumber* or *WorkphoneMobileCountryCodeNumber***

```C#
Replace([telephoneNumber], , "\\+(?<isdCode>\\d*) (?<phoneNumber>.*)", , "${isdCode}", , )
```

**Example mapping for *WorkphoneLandlineCountryCodeName* or *WorkphoneMobileCountryCodeName***

The expression below extracts the isdCode and uses [Switch](../app-provisioning/functions-for-customizing-application-data.md#switch) function to lookup the right country code name to send to Workday. 

```C#
Switch(Replace([telephoneNumber], , "\\+(?<isdCode>\\d*) (?<phoneNumber>.*)", , "${isdCode}", , ), "USA",
"93", "AFG", "355", "ALB", "213", "DZA", "376", "AND", "244", "AGO",  "54", "ARG", "374", "ARM", "297", "ABW", "61", "AUS", "43", "AUT", "994", "AZE", "973", "BHR", "880", "BGD", 
"375", "BLR", "32", "BEL", "501", "BLZ", "229", "BEN", "975", "BTN", "591", "BOL", "599", "BES", "387", "BIH", "267", "BWA", "55", "BRA", "246", "IOT", "673", "BRN", "359", "BGR", 
"226", "BFA", "257", "BDI", "238", "CPV", "855", "KHM", "237", "CMR", "236", "CAF", "235", "TCD", "56", "CHL", "86", "CHN", "57", "COL", "269", "COM", "242", "COG", "243", "COD", 
"682", "COK", "506", "CRI", "225", "CIV", "385", "HRV", "53", "CUB", "357", "CYP", "420", "CZE", "45", "DNK", "253", "DJI", "593", "ECU", "20", "EGY", "503", "SLV", "240", "GNQ", 
"291", "ERI", "372", "EST", "268", "SWZ", "251", "ETH", "500", "FLK", "298", "FRO", "679", "FJI", "358", "FIN", "33", "FRA", "594", "GUF", "689", "PYF", "241", "GAB", "220", "GMB", 
"995", "GEO", "49", "DEU", "233", "GHA", "350", "GIB", "30", "GRC", "299", "GRL", "590", "GLP", "502", "GTM", "224", "GIN", "245", "GNB", "592", "GUY", "509", "HTI", "504", "HND", 
"852", "HKG", "36", "HUN", "354", "ISL", "91", "IND", "62", "IDN", "98", "IRN", "964", "IRQ", "353", "IRL", "972", "ISR", "39", "ITA", "81", "JPN", "962", "JOR", "254", "KEN", "686", 
"KIR", "850", "PRK", "82", "KOR", "383", "XKX", "965", "KWT", "996", "KGZ", "856", "LAO", "371", "LVA", "961", "LBN", "266", "LSO", "231", "LBR", "218", "LBY", "423", "LIE", "370", 
"LTU", "352", "LUX", "853", "MAC", "261", "MDG", "265", "MWI", "60", "MYS", "960", "MDV", "223", "MLI", "356", "MLT", "692", "MHL", "596", "MTQ", "222", "MRT", "230", "MUS", "262", 
"REU", "52", "MEX", "691", "FSM", "373", "MDA", "377", "MCO", "976", "MNG", "382", "MNE", "212", "MAR", "258", "MOZ", "95", "MMR", "264", "NAM", "674", "NRU", "977", "NPL", "31", 
"NLD", "687", "NCL", "64", "NZL", "505", "NIC", "227", "NER", "234", "NGA", "683", "NIU", "672", "NFK", "389", "MKD", "47", "NOR", "968", "OMN", "92", "PAK", "680", "PLW", "970", 
"PSE", "507", "PAN", "675", "PNG", "595", "PRY", "51", "PER", "63", "PHL", "870", "PCN", "48", "POL", "351", "PRT", "974", "QAT", "40", "ROU", "7", "RUS", "250", "RWA", "290", "SHN", 
"508", "SPM", "685", "WSM", "378", "SMR", "239", "STP", "966", "SAU", "221", "SEN", "381", "SRB", "248", "SYC", "232", "SLE", "65", "SGP", "421", "SVK", "386", "SVN", "677", "SLB", 
"252", "SOM", "27", "ZAF", "211", "SSD", "34", "ESP", "94", "LKA", "249", "SDN", "597", "SUR", "46", "SWE", "41", "CHE", "963", "SYR", "886", "TWN", "992", "TJK", "255", "TZA", "66", 
"THA", "670", "TLS", "228", "TGO", "690", "TKL", "676", "TON", "216", "TUN", "90", "TUR", "993", "TKM", "688", "TUV", "256", "UGA", "380", "UKR", "971", "ARE", "44", "GBR", "1", 
"USA", "598", "URY", "998", "UZB", "678", "VUT", "58", "VEN", "84", "VNM", "681", "WLF", "967", "YEM", "260", "ZMB", "263", "ZWE"
)
```

### Derive country codes from Azure AD *usageLocation* attribute 
If you want to set the country code name and country code number in Workday based on the *usageLocation* attribute, then use the expression mappings below to convert the two-letter country code to appropriate three-letter country code name and country code number. 

**Example mapping for *WorkphoneLandlineCountryCodeNumber* or *WorkphoneMobileCountryCodeNumber***

```C#
Switch([usageLocation], "1", "AF", "93", "AX", "358", "AL", "355", "DZ", "213", "AS", "1", "AD", "376", "AO", "244", "AI", "1", "AG", "1", "AR", "54", "AM", "374", "AW", "297", "AU", 
"61", "AT", "43", "AZ", "994", "BS", "1", "BH", "973", "BD", "880", "BB", "1", "BY", "375", "BE", "32", "BZ", "501", "BJ", "229", "BM", "1", "BT", "975", "BO", "591", "BQ", "599", 
"BA", "387", "BW", "267", "BR", "55", "IO", "246", "VG", "1", "BN", "673", "BG", "359", "BF", "226", "BI", "257", "CV", "238", "KH", "855", "CM", "237", "CA", "1", "KY", "1", "CF", 
"236", "TD", "235", "CL", "56", "CN", "86", "CX", "61", "CC", "61", "CO", "57", "KM", "269", "CG", "242", "CD", "243", "CK", "682", "CR", "506", "CI", "225", "HR", "385", "CU", "53", 
"CW", "599", "CY", "357", "CZ", "420", "DK", "45", "DJ", "253", "DM", "1", "DO", "1", "EC", "593", "EG", "20", "SV", "503", "GQ", "240", "ER", "291", "EE", "372", "SZ", "268", "ET", 
"251", "FK", "500", "FO", "298", "FJ", "679", "FI", "358", "FR", "33", "GF", "594", "PF", "689", "GA", "241", "GM", "220", "GE", "995", "DE", "49", "GH", "233", "GI", "350", "GR", 
"30", "GL", "299", "GD", "1", "GP", "590", "GU", "1", "GT", "502", "GG", "44", "GN", "224", "GW", "245", "GY", "592", "HT", "509", "VA", "39", "HN", "504", "HK", "852", "HU", "36", 
"IS", "354", "IN", "91", "ID", "62", "IR", "98", "IQ", "964", "IE", "353", "IM", "44", "IL", "972", "IT", "39", "JM", "1", "JP", "81", "JE", "44", "JO", "962", "KZ", "7", "KE", 
"254", "KI", "686", "KP", "850", "KR", "82", "XK", "383", "KW", "965", "KG", "996", "LA", "856", "LV", "371", "LB", "961", "LS", "266", "LR", "231", "LY", "218", "LI", "423", "LT", 
"370", "LU", "352", "MO", "853", "MG", "261", "MW", "265", "MY", "60", "MV", "960", "ML", "223", "MT", "356", "MH", "692", "MQ", "596", "MR", "222", "MU", "230", "YT", "262", "MX", 
"52", "FM", "691", "MD", "373", "MC", "377", "MN", "976", "ME", "382", "MS", "1", "MA", "212", "MZ", "258", "MM", "95", "NA", "264", "NR", "674", "NP", "977", "NL", "31", "NC", 
"687", "NZ", "64", "NI", "505", "NE", "227", "NG", "234", "NU", "683", "NF", "672", "MK", "389", "MP", "1", "NO", "47", "OM", "968", "PK", "92", "PW", "680", "PS", "970", "PA", 
"507", "PG", "675", "PY", "595", "PE", "51", "PH", "63", "PN", "870", "PL", "48", "PT", "351", "PR", "1", "QA", "974", "RE", "262", "RO", "40", "RU", "7", "RW", "250", "BL", "590", 
"SH", "290", "KN", "1", "LC", "1", "MF", "590", "PM", "508", "VC", "1", "WS", "685", "SM", "378", "ST", "239", "SA", "966", "SN", "221", "RS", "381", "SC", "248", "SL", "232", "SG", 
"65", "SX", "1", "SK", "421", "SI", "386", "SB", "677", "SO", "252", "ZA", "27", "SS", "211", "ES", "34", "LK", "94", "SD", "249", "SR", "597", "SJ", "47", "SE", "46", "CH", "41", 
"SY", "963", "TW", "886", "TJ", "992", "TZ", "255", "TH", "66", "TL", "670", "TG", "228", "TK", "690", "TO", "676", "TT", "1", "TN", "216", "TR", "90", "TM", "993", "TC", "1", "TV", 
"688", "VI", "1", "UG", "256", "UA", "380", "AE", "971", "GB", "44", "UM", "246", "US", "1", "UY", "598", "UZ", "998", "VU", "678", "VE", "58", "VN", "84", "WF", "681", "EH", "212", 
"YE", "967", "ZM", "260", "ZW", "263")
```

**Example mapping for *WorkphoneLandlineCountryCodeName* or *WorkphoneMobileCountryCodeName***

```C#
Switch([usageLocation], "USA", "AF", "AFG", "AX", "ALA", "AL", "ALB", "DZ", "DZA", "AS", "ASM", "AD", "AND", "AO", "AGO", "AI", "AIA", "AG", "ATG", "AR", "ARG", "AM", "ARM", "AW", 
"ABW", "AU", "AUS", "AT", "AUT", "AZ", "AZE", "BS", "BHS", "BH", "BHR", "BD", "BGD", "BB", "BRB", "BY", "BLR", "BE", "BEL", "BZ", "BLZ", "BJ", "BEN", "BM", "BMU", "BT", "BTN", "BO", 
"BOL", "BQ", "BES", "BA", "BIH", "BW", "BWA", "BR", "BRA", "IO", "IOT", "VG", "VGB", "BN", "BRN", "BG", "BGR", "BF", "BFA", "BI", "BDI", "CV", "CPV", "KH", "KHM", "CM", "CMR", "CA", 
"CAN", "KY", "CYM", "CF", "CAF", "TD", "TCD", "CL", "CHL", "CN", "CHN", "CX", "CXR", "CC", "CCK", "CO", "COL", "KM", "COM", "CG", "COG", "CD", "COD", "CK", "COK", "CR", "CRI", "CI", 
"CIV", "HR", "HRV", "CU", "CUB", "CW", "CUW", "CY", "CYP", "CZ", "CZE", "DK", "DNK", "DJ", "DJI", "DM", "DMA", "DO", "DOM", "EC", "ECU", "EG", "EGY", "SV", "SLV", "GQ", "GNQ", "ER", 
"ERI", "EE", "EST", "SZ", "SWZ", "ET", "ETH", "FK", "FLK", "FO", "FRO", "FJ", "FJI", "FI", "FIN", "FR", "FRA", "GF", "GUF", "PF", "PYF", "GA", "GAB", "GM", "GMB", "GE", "GEO", "DE", 
"DEU", "GH", "GHA", "GI", "GIB", "GR", "GRC", "GL", "GRL", "GD", "GRD", "GP", "GLP", "GU", "GUM", "GT", "GTM", "GG", "GGY", "GN", "GIN", "GW", "GNB", "GY", "GUY", "HT", "HTI", "VA", 
"VAT", "HN", "HND", "HK", "HKG", "HU", "HUN", "IS", "ISL", "IN", "IND", "ID", "IDN", "IR", "IRN", "IQ", "IRQ", "IE", "IRL", "IM", "IMN", "IL", "ISR", "IT", "ITA", "JM", "JAM", "JP", 
"JPN", "JE", "JEY", "JO", "JOR", "KZ", "KAZ", "KE", "KEN", "KI", "KIR", "KP", "PRK", "KR", "KOR", "XK", "XKX", "KW", "KWT", "KG", "KGZ", "LA", "LAO", "LV", "LVA", "LB", "LBN", "LS", 
"LSO", "LR", "LBR", "LY", "LBY", "LI", "LIE", "LT", "LTU", "LU", "LUX", "MO", "MAC", "MG", "MDG", "MW", "MWI", "MY", "MYS", "MV", "MDV", "ML", "MLI", "MT", "MLT", "MH", "MHL", "MQ", 
"MTQ", "MR", "MRT", "MU", "MUS", "YT", "MYT", "MX", "MEX", "FM", "FSM", "MD", "MDA", "MC", "MCO", "MN", "MNG", "ME", "MNE", "MS", "MSR", "MA", "MAR", "MZ", "MOZ", "MM", "MMR", "NA", 
"NAM", "NR", "NRU", "NP", "NPL", "NL", "NLD", "NC", "NCL", "NZ", "NZL", "NI", "NIC", "NE", "NER", "NG", "NGA", "NU", "NIU", "NF", "NFK", "MK", "MKD", "MP", "MNP", "NO", "NOR", "OM", 
"OMN", "PK", "PAK", "PW", "PLW", "PS", "PSE", "PA", "PAN", "PG", "PNG", "PY", "PRY", "PE", "PER", "PH", "PHL", "PN", "PCN", "PL", "POL", "PT", "PRT", "PR", "PRI", "QA", "QAT", "RE", 
"REU", "RO", "ROU", "RU", "RUS", "RW", "RWA", "BL", "BLM", "SH", "SHN", "KN", "KNA", "LC", "LCA", "MF", "MAF", "PM", "SPM", "VC", "VCT", "WS", "WSM", "SM", "SMR", "ST", "STP", "SA", 
"SAU", "SN", "SEN", "RS", "SRB", "SC", "SYC", "SL", "SLE", "SG", "SGP", "SX", "SXM", "SK", "SVK", "SI", "SVN", "SB", "SLB", "SO", "SOM", "ZA", "ZAF", "SS", "SSD", "ES", "ESP", "LK", 
"LKA", "SD", "SDN", "SR", "SUR", "SJ", "SJM", "SE", "SWE", "CH", "CHE", "SY", "SYR", "TW", "TWN", "TJ", "TJK", "TZ", "TZA", "TH", "THA", "TL", "TLS", "TG", "TGO", "TK", "TKL", "TO", 
"TON", "TT", "TTO", "TN", "TUN", "TR", "TUR", "TM", "TKM", "TC", "TCA", "TV", "TUV", "VI", "VIR", "UG", "UGA", "UA", "UKR", "AE", "ARE", "GB", "GBR", "UM", "UMI", "US", "USA", "UY", 
"URY", "UZ", "UZB", "VU", "VUT", "VE", "VEN", "VN", "VNM", "WF", "WLF", "EH", "ESH", "YE", "YEM", "ZM", "ZMB", "ZW", "ZWE")
```

### Extracting a 10-digit phone number

Use the below regular expression, if phone number in Azure AD is set using the format required for Self Service Password Reset (SSPR). <br>
Example: if the phone number value is +1 1112223333 -> then the regex expression will output 1112223333

```C#
Replace([telephoneNumber], , "\\+(?<isdCode>\\d* )(?<phoneNumber>\\d{10})", , "${phoneNumber}", , )
```
### Removing spaces, dashes and brackets in a phone number

Use the below regular expression, if phone number in Azure AD is set using the format (XXX) XXX-XXXX. <br>
Example: if the phone number value is (111) 222-3333 -> then the regex expression will output 1112223333

```C#
Replace([mobile], , "[()\\s-]+", , "", , )
```

### Handling landline phone number extensions

Let's say that all phone numbers in Azure AD have extension numbers and you want to populate the extension numbers in Workday. 
This example assumes that phone numbers are stored in the format: `+<isdCode><space><phoneNumber><space>x<extensionNumber>` and the extension number appears after the `x` character. <br>

To extract the components of this phone number, use the expressions below: 

**Example mapping for *WorkphoneLandlineNumber***

If *telephoneNumber* has the value `+1 (206) 291-8163 x8125`, the expression below will return `2062918163`.
```C#
Replace(Replace([telephoneNumber], , "\+(?<isdCode>\d* )(?<phoneNumber>.* )[x](?<extension>.*)", , "${phoneNumber}", , ), ,"[()\\s-]+", ,"", , ) 
```

**Example mapping for *WorkphoneLandlineCountryCodeNumber***

If *telephoneNumber* has the value `+1 (206) 291-8163 x8125`, the expression below will return `1`.
```C#
Replace(Replace([telephoneNumber], , "\+(?<isdCode>\d* )(?<phoneNumber>.* )[x](?<extension>.*)", , "${isdCode}", , ), ,"[()\\s-]+", ,"", , ) 
```

**Example mapping for *WorkphoneLandlineExtension***

If *telephoneNumber* has the value `+1 (206) 291-8163 x8125`, the expression below will return `8125`.
```C#
Replace(Replace([telephoneNumber], , "\+(?<isdCode>\d* )(?<phoneNumber>.* )[x](?<extension>.*)", , "${extension}", , ), ,"[()\\s-]+", ,"", , )
```

## Enable and launch user provisioning

Once the Workday provisioning app configurations have been completed, you can turn on the provisioning service in the Azure portal.

> [!TIP]
> By default when you turn on the provisioning service, it will initiate provisioning operations for all users in scope. If there are errors in the mapping or Workday data issues, then the provisioning job might fail and go into the quarantine state. To avoid this, as a best practice, we recommend configuring **Source Object Scope** filter and testing  your attribute mappings with a few test users using the [provision on demand](../app-provisioning/provision-on-demand.md) feature before launching the full sync for all users. Once you have verified that the mappings work and are giving you the desired results, then you can either remove the filter or gradually expand it to include more users.

1. In the **Provisioning** tab, set the **Provisioning Status** to **On**.

1. In the **Scope** dropdown, select **Sync all users and groups**. With this option, the Writeback app will write back mapped attributes of all users from Azure AD to Workday, subject to the scoping rules defined under **Mappings** -> **Source Object Scope**. 

   > [!div class="mx-imgBorder"]
   > ![Select Writeback scope](./media/sap-successfactors-inbound-provisioning/select-writeback-scope.png)

   > [!NOTE]
   > The Workday Writeback provisioning app does not support the option **Sync only assigned users and groups**.
 

2. Click **Save**.

3. This operation will start the initial sync, which can take a variable number of hours depending on how many users are in the source directory. You can check the progress bar to the track the progress of the sync cycle. 

4. At any time, check the **Provisioning logs** tab in the Azure portal to see what actions the provisioning service has performed. The audit logs lists all individual sync events performed by the provisioning service, such as which users are imported from the source and exported to the target application.  

5. Once the initial sync is completed, it will write a summary report in the **Provisioning** tab, as shown below.

     > [!div class="mx-imgBorder"]
     > ![Provisioning progress bar](./media/sap-successfactors-inbound-provisioning/prov-progress-bar-stats.png)


## Known issues and limitations

* The Writeback app uses a pre-defined value for parameters **Communication_Usage_Type_ID** and **Phone_Device_Type_ID**. If your Workday tenant is using a different value for these attributes, then the Writeback operation will not succeed. A suggested workaround is to update the Type_IDs in Workday. 
* When the Writeback app is configured to update secondary phone numbers, it does not replace the existing secondary phone number in Workday. It adds one more secondary phone number to the worker record. There is no workaround to this behavior. 


## Next steps

* [Learn more about Azure AD and Workday integration scenarios and web service calls](../app-provisioning/workday-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
* [Learn how to configure single sign-on between Workday and Azure Active Directory](workday-tutorial.md)
* [Learn how to integrate other SaaS applications with Azure Active Directory](tutorial-list.md)
* [Learn how to export and import your provisioning configurations](../app-provisioning/export-import-provisioning-configuration.md)
