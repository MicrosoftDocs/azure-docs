# Prepare localized apps and add-ins

To offer your Office Add-in, SharePoint Add-in, or Office 365 app in languages beyond the primary language, you will need localized metadata for each additional language. The best customer experience is with apps or add-ins that have web services and functionality that support these additional languages. You will also need to create descriptions in each language. For a list of the languages that the Seller Dashboard currently accepts, see Table 2 later in this article.
 


> [!NOTE]
> For information about localizing add-ins, see  [Localization for Office Add-ins](https://dev.office.com/docs/add-ins/develop/localization) and [Localize SharePoint Add-ins](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/localize-sharepoint-add-ins). 
 


To distribute your app or add-in in additional languages, you can edit the details in the Seller Dashboard. After you add other languages, you will need to submit it for approval again. 
 

 

 

In the case of previously approved add-ins, if you updated your manifest, you will need to ensure that you update the add-in version in the manifest and in the submission form. The current add-in version will remain in the Office Store until your new add-in is approved, unless you unpublish the current add-in. For more information, see  [Update, unpublish, and view metrics in the Seller Dashboard](update-unpublish-and-view-metrics.md). 
 

> [!NOTE]
> You can block customers in a certain country/region from acquiring or using your app or add-in when you add or edit it in the Seller Dashboard.
 

To distribute your app or add-in in additional languages, you can edit the details in the Seller Dashboard. After you add other languages, you will need to submit it for approval again. 
 

 

 
In the case of previously approved add-ins, if you updated your manifest, you will need to ensure that you update the add-in version in the manifest and in the submission form. The current add-in version will remain in the Office Store until your new add-in is approved, unless you unpublish the current add-in. For more information, see  [Update, unpublish, and view metrics in the Seller Dashboard](update-unpublish-and-view-metrics.md). 
 
> [!NOTE]
> You can block customers in a certain country/region from acquiring or using your app or add-in when you add or edit it in the Seller Dashboard.
 


## Localized Office Store fronts

The Office Store is available in 40 languages in 60 corresponding markets, as listed in Table 2. In each of these markets, the Office Store displays metadata in either English or the corresponding language. When you submit an app or add-in, you can provide metadata (descriptions, screen shots, title) in the languages that you would like to be listed in, and explicitly specify these languages as submission languages in the Seller Dashboard. Verify that the primary submission language is in the add-in manifest, if applicable. If English is the only submission language, by default, your app or add-in will be listed in the Office Store fronts in all 60 markets with English metadata. If any of the non-English languages is a submission language, your app or add-in will be listed in the Office Store fronts in the corresponding markets, with metadata in that language. If English and any of the other non-English languages are submission languages, the app or add-in will be listed in all 60 markets with English metadata, except for those markets for which the corresponding non-English language has been submitted, where the metadata will be in the corresponding language.
 

 
In the Seller Dashboard, you can explicitly block markets in which to distribute your app or add-in. 
 

 
Users can verify whether a market-specific Office Store front is available for a market by selecting that market in the upper-right of the store page, as shown in Figure 1. From there, users either are directed to the market-specific store front, or if that store front is not available, see a message that suggests that they go the Office Store in the United States.

*Figure 1. Verify or choose a different market in the Office Store*

![Choose a different market for the Office Store](images/mod-office15-office-store-choose-market.png)
 
The following table lists the submission languages that the Office Store is available in, and the locales and markets that correspond to each of these languages. For a list of all the languages and locales for which you can localize an app or add-in, see [Language identifiers and OptionState Id values in Office 2013](http://technet.microsoft.com/en-us/library/cc179219%28Office.15%29.aspx).
 

 

**List of distribution languages and corresponding markets for the Office Store**


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

## Additional resources
<a name="bk_addresources"> </a>

- [Validation policies for apps and add-ins submitted to the Office Store](validation-policies.md) 
- [Use the Seller Dashboard to submit your solution to the Office Store](use-the-seller-dashboard-to-submit-to-the-office-store.md)
- [Submit your solutions to the Office Store](submit-to-the-office-store.md)    
 

