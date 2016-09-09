<properties
   pageTitle="42 characters followed by | Microsoft Azure to equal 60 characters. This title is displayed in search engines which will cut you off at 60 characters. Use keywords but don’t waste space"
   description="Displayed in search engines under the title. You have more room here, use more keywords and a more descriptive explanation than the title"
   services="service-name"
   documentationCenter="dev-center-name"
   authors="GitHub-alias-of-only-one-author"
   manager="manager-alias"
   editor=""
   tags="top-support-issue"/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="Your MSFT alias or your full email address;semicolon separates two or more"/>

# Title (Maximum 120 characters, target the primary keyword)

_Use 2-3 secondary keywords in the description._

_Select one of the following disclaimers depending on your scenario. If your article is deployment model agnostic, ignore this._

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

[AZURE.INCLUDE [learn-about-deployment-models](../../learn-about-deployment-models-both-include.md)]

[Opening paragraph]
- _Briefly describe the specific issue(s) that this article will help troubleshoot, and the common root cause(s)._
- _The opening paragraph is a good place to use different keywords from those in the title, but make sure to not make it very wordy. The sentences should flow well and be easy to understand._
- _Exceptions (optional) - List the relevant scenarios that are not covered in this article. For example, ” Linux/OSS scenarios aren't covered in this article”._

These {errors}|{Issues} occur because {a very general reason}.

_Here is an example of an opening paragraph._

_When you try to connect to Azure SQL Database, the common connection errors you encounter are:_
- _The login failed for the user. The password change failed._
- _Password validation failed._
- _Failed to authorize access to the specified subscription._

_These errors occur because you don’t have permission to access the data source._

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting guidance (optional)
- _Use this section when the guidance applies across the board._
- _Don’t go into details. Keep it high level to serve as a guidance._

_Here is an example of a troubleshooting guidance._

_In general, as long as the error does not indicate "the requested VM size is not supported", you can always retry at a later time, as enough resource may have been freed up in the cluster to accommodate your request. If the problem is the requested VM size is not supported, try a different VM size; otherwise, the only option is to remove the pinning constraint._

## Troubleshooting steps
_List the solutions in the order of usability and simplicity, meaning the simplest, the most effective and useful solution should go first._

_Select one of the versions that apply to your situation._

| <em>Version 1: Your article is deployment model agnostic</em> | <em>Version 2: Steps for Resource Manager and Classic are largely the same</em> | <em>Version 3: Steps for Resource Manager and Classic are mostly different. <br />In this case, use the <a href="https://github.com/Azure/azure-content-pr/blob/master/contributor-guide/custom-markdown-extensions.md#simple-selectors">Simple Selectors technique in Github</a>.</em> |
|:------------------------------------------------------|:-----------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <p><h3>[Issue 1] \| [Error 1]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h4>Solution 2</h4><em>(the less simple or effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h3>[Issue 2] \| [Error 2]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h4>Solution 2</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /> | <p><h3>[Issue 1] \| [Error 1]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>If you use the classic deployment model, [do this].<br />If you use the Resource Manager deployment model, [do this].</li><li>[Step 3]</li></ol><p><h4>Solution 2</h4><em>(the less simple or effective)</em></p><ol><li>[Step 1]</li><li>If you use the classic deployment model, [do this].<br />If you use the Resource Manager deployment model, [do this].</li><li>[Step 3]</li></ol><p><h3>[Issue 2] \| [Error 2]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>If you use the classic deployment model, [do this].<br />If you use the Resource Manager deployment model, [do this].</li><li>[Step 3]</li></ol><p><h4>Solution 2</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>If you use the classic deployment model, [do this].<br />If you use the Resource Manager deployment model, [do this].</li><li>[Step 3]</li></ol>  | <img src="media/markdown-template-for-support-articles-troubleshoot/rm-classic.png" alt="ARM-Classic"><p><h3>[Issue 1] \| [Error 1]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h4>Solution 2</h4><em>(the less simple or effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h3>[Issue 2] \| [Error 2]</h3><h4>Cause</h4>[Cause details]</p><p><h4>Solution 1</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><p><h4>Solution 2</h4><em>(the simplest and most effective)</em></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /> |


## Next steps
_Include this section if there are 1 -3 concrete, highly relevant next steps the user should take. Delete if there are no next steps. This is not a place for a list of links. If you include links to next steps, make sure to include text to explain why the next steps are relevant/ important._
