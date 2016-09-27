<properties title="" pageTitle="Azure technical content channel guidance" description="Describes the Microsoft content channels that employees, partners, and community contributors should use for publishing Azure technical content." metaKeywords="" services="" solutions="" documentationCenter="" authors="tysonn" videoId="" scriptId="" manager="carolz" />

<tags ms.service="contributor-guide" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="" ms.date="01/06/2015" ms.author="tysonn" />

# Azure technical content channel guidance

GitHub is a relatively easy way (once you get over the Git hump) to author and publish technical content. But we need to ensure that content stays within the boundaries of technical documentation - there are other channels for other types of information.

- **Technical articles about using the product** belong in the azure-content​/azure-content-pr repositories for publication to http://azure.microsoft.com/documentation/articles. They should contain conceptual or procedural information required to understand and use the product. The technical content channel is for technical content showing people **how** to do something. You can talk about the "what" and "why" to help customers understand intent, but the articles should focus on the actual content telling people how to do the task or complete the scenario.

- **Reference content**: managed reference, REST APIs, PowerShell cmdlet help, schema reference, and error reference belongs in the MSDN scoped Azure library (http://msdn.microsoft.com/library/azure/). Node, Ruby, and other language reference content belongs on http://azure.github.io/​.

- **First person/announcements**: Content written in the first person voice and that is generally related to announcements and promotions typically belongs on the Azure blog.

- **Code and project samples**: These go in the samples repositories and are featured in the sample gallery.

Beyond this, there are specific types of deliverable and subject matter areas that are not part of the technical documentation experience because these deliverables and subject matter areas belong in other content channels or should not be handled as documentation articles.​ Here's a checklist:

- **Pricing information**: You can talk about the impact technical choices have on cost in a general way, but do not quote specific pricing details in technical articles. Instead, provide a link to the pricing page for the service you're talking about.

- **Marketing content**: Content that provides a high-level feature/benefit description or that just lists at a high level the capabilities of a service is probably marketing content. It belongs in marketing areas of the site. To publish marketing content, file a work request for azure.microsoft.com.

- **Future product plans**: Do not publish statements about future product plans in technical documentation. Technical documentation should describe only what is possible in the released product.​

- **What's new in a release or service**:  Lists or descriptions of what is new in a release or service go to the Service Updates channel.

- **Release notes**: Unless it's an SDK article or a StorSimple article for a hardware update, this sort of information should just be embedded in the relevant technical content.

- **Legal terms**: There are all-up Azure legal terms​.

- **Privacy notices**: There is an all-up privacy policy for Microsoft Online Services that covers all of Azure. Privacy information specific to a service should be presented as technical content, not "privacy statements".

- **Redirect articles**:  When you delete the content of an article, do not leave the article published with a link to the replacement content. Use a real redirect.

- **Pointer articles to downloads**: Instead of pointing small pages that contain nothing but a link to a download, just link to the download from the relevant technical content.

- **Soliciting feedback via email addresses**: The approved feedback paths for Azure content include the feedback link that appears in the site footer, the satisfaction rating and verbatim control, the Disqus comments, direct article contributions through GitHub pull requests, and the UserVoice site. Please don't add to this plethora of channels by asking people to send feedback via email.

- **Community spotlight**: Articles featuring community projects. The repo is for technical content about how to use the product from the Microsoft persective, not about how people are using the product. That's marketing or possibly blog content. Or, let the community tell it's own story in the places that community likes best!

- **Case studies**: Case studies are a very specific deliverable that goes through marketing, they have their own process and guidelines and are created from specific customer and partner engagements. Don't call something a case study unless it's part of the formal case study process.

- **Downloadable files**: Technical documents should be delivered as articles, not downloads. Other downloabable things should go to the Download Center.
