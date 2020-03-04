*Note: This is a temporary page.  **This will not be published.***

Robert Outlaw's (routlaw) team maintains reference document architecture across the board, from Office and Windows to .NET and Azure.  He works with vendors that take **product team requirements** and generate **reference docs**.

Every team's set of needs is unique, which means that we have a lot of processes available to us. These processes have been documented in many places:

 - https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/10/Welcome-and-Onboarding
 - https://azure.github.io/azure-sdk-for-net/
 - https://github.com/Azure/adx-documentation-pr/wiki
 - https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/?branch=master

In general, product teams and content developers will not be exposed to the complexity of these processes. Your team will create packages (for non-REST APIs) or a Swagger specs (for REST APIs) and then hand these to Robert's team along with your privacy requirements and the target repository (where the auto-generated documentation will land). Within about three days, your reference documentation should be available in your target repository.

The first place to start is Step 1 on [this page](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/dotnet/road-to-docs?branch=master). This tells you how to prepare your code for handoff to Rob's team. Once your code is prepared, send Robert an email with the following:

- Your prepared packages' locations (myget / nuget / npm / etc)
- Your privacy needs (can this reference documentation's metadata be exposed to the public? Does it need to be completely locked down from public consumption?)
- Your target repository's location

Robert will then loop back with any clarifying questions before passing the baton off to the vendor team who will generate your docs.