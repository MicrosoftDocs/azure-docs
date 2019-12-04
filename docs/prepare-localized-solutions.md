---
title: Prepare localized solutions
description: Obtain localized metadata and create descriptions for each language beyond the primary language.
ms.date: 1/11/2018
localization_priority: Normal
---

# Prepare localized solutions

To offer your add-in solution in languages beyond the primary language, you need localized metadata for each additional language. For add-ins, the best customer experience is to provide web services and functionality that support these additional languages. You also need to create descriptions in each language. For a list of the languages that Partner Center currently accepts, see the table later in this article.

> [!NOTE]
> For information about localizing add-ins, see [Localization for Office Add-ins](https://docs.microsoft.com/office/dev/add-ins/develop/localization) and [Localize SharePoint Add-ins](https://docs.microsoft.com/sharepoint/dev/sp-add-ins/localize-sharepoint-add-ins). 

To distribute your solution in additional languages, choose **Manage additional languages** on the **Marketplace listings** page in Partner Center. After you add other languages, you need to submit your solution for certfication again. 

For previously approved add-ins, if you updated your manifest, you need to ensure that you update the add-in version in the manifest. The current add-in version remains in AppSource and the in-product experience until your new add-in is approved, unless you unpublish the current add-in. 

## Localized AppSource fronts

AppSource is available in 40 languages in 60 corresponding markets. In each of these markets, AppSource displays metadata in either English or the corresponding language. When you submit your solution, you can provide metadata (descriptions, screen shots, name) in the languages that you would like to be listed in, and explicitly specify these languages on the **Marketplace listings** page in Partner Center. Verify that the primary submission language is in the add-in manifest, if applicable. 

If English is the only submission language, by default, your solution is listed in AppSource fronts in all 60 markets with English metadata. 

If a non-English language is the submission language, your solution is listed in AppSource fronts in the corresponding markets, with metadata in that language. 

If English and any other non-English language are submission languages, the solution is listed in all 60 markets with English metadata, except for those markets for which the corresponding non-English language has been submitted, where the metadata is in the corresponding language.

The following table lists the submission languages that AppSource is available in, and the locales and markets that correspond to each of these languages. 

**List of distribution languages and corresponding markets for AppSource**

|**Submission language**|**Locale (language tag)**|**Market (country/region)**|
|:-----|:-----|:-----|
|English|en-us|United States|
|English|en-au|Australia|
|English|en-ca|Canada - English|
|English|en-gb|United Kingdom|
|English|en-in|India|
|English|en-ie|Ireland|
|English|en-nz|New Zealand|
|English|en-sg|Singapore|
|English|en-za|South Africa|
|English|en-001|International English|
|French|fr-fr|France|
|French|fr-be|Belgium|
|French|fr-ca|Canada - French|
|French|fr-ch|Switzerland|
|French|fr-001|International French|
|German|de-de|Germany|
|German|de-at|Austria|
|German|de-ch|Switzerland|
|Japanese|ja-jp|Japan|
|Spanish|es-es|Spain|
|Spanish|es-mx|Mexico|
|Spanish|es-hn|Honduras|
|Spanish|es-ar|Argentina|
|Italian|it-it|Italy|
|Dutch|nl-be|Belgium|
|Dutch|nl-nl|The Netherlands|
|Russian|ru-ru|Russia|
|Chinese |zh-cn|China (PRC)|
|Chinese |zh-hk|Chinese (Hong Kong SAR)|
|Chinese |zh-tw|Taiwan|
| Portuguese|pt-br|Brazil|
|Portuguese|pt-pt|Portugal|
|Arabic|ar-sa|Saudi Arabia|
|Bulgarian|bg-bg|Bulgaria|
|Czech|cs-cz|Czech Republic|
|Danish|da-dk|Denmark|
|Greek|el-gr|Greece|
|Estonian| et-ee|Estonia|
|Finnish|fi-fi|Finland|
|Hebrew|he-il|Israel|
|Hindi|hi-in|India|
|Croatian|hr-hr|Croatia|
|Hungarian|hu-hu|Hungary|
|Indonesian|id-id|Indonesia|
|Kazakh|kk-kz|Kazakhstan|
|Korean|ko-kr|Korea|
|Lithuanian|lt-lt|Lithuania|
|Latvian|lv-lv|Latvia|
|Malay|ms-my|Malaysia|
|Norwegian|nb-no|Norway|
|Polish|pl-pl|Poland|
|Romanian|ro-ro|Romania|
|Serbian (Latin)|sr-latn-rs|Serbia|
|Slovenian|sl-si|Slovenia|
|Slovak|sk-sk|Slovakia|
|Swedish|sv-se|Sweden|
|Thai|th-th|Thailand|
|Turkish|tr-tr|Turkey|
|Ukranian|uk-ua|Ukraine|
|Vietnamese|vi-vn|Vietnam|

## See also
<a name="bk_addresources"> </a>

- [Submit your Office solution to AppSource via Partner Center](use-partner-center-to-submit-to-appsource.md)    
- [Validation policies](validation-policies.md) 

 

