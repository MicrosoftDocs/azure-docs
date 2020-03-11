*Note: This is a temporary page.  **This will not be published.***

*Note: Pending review and approval by Robert Outlaw.*

-- 

### Intro

Robert Outlaw's (routlaw) team maintains reference document architecture across the board, from Office and Windows to .NET and Azure.  He works with vendors that generate **reference docs** from **SDKs and Swagger specs** prepared by **product teams**.

Every team's set of needs is unique, which means that we have a lot of processes available to us. These processes have been documented in several locations ([dev.azure](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/10/Welcome-and-Onboarding), [azure.github](https://azure.github.io/azure-sdk-for-net/), [github/azure](https://github.com/Azure/adx-documentation-pr/wiki), [review.docs](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/?branch=master)).

In general, product teams and content developers will not be exposed to the complexity of these processes. Product teams create packages (for non-REST APIs) or a Swagger specs (for REST APIs) and then hand these to Robert's team. Within about three days, reference documentation should be available.

### Generating Non-REST Reference Docs

Step 1 on [this page](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/dotnet/road-to-docs?branch=master) tells us how to prepare our code for handoff to Robert's team. 

 - For JS, it looks like [TypeDoc](http://typedoc.org/guides/doccomments/) conventions are used ([source](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/js-ts/documenting-api?branch=master)).
 - For C#, the instructions are documented [here](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/dotnet/documenting-api?branch=master).

Once the code is prepared, we'll send Robert an email with the following:

- Our prepared **packages' locations** (myget / nuget / npm / etc)
  - *For our **C# SDKs**, I believe that's Microsoft.Azure.Spool.Client and Microsoft.Azure.Spool.Server on myget: https://www.myget.org/F/spool-sdk/auth/d2d18e05-8424-467c-9b5b-9194847fcf64/api/v3/index.json*
  - *For our **JS SDKs**, I believe that's:*
    - "@azure/spool-auth": "https://www.myget.org/F/spool-sdk/auth/de20e499-3c4d-4204-bada-c209d6b770b6/npm/@azure/spool-auth/-/0.1.4.tgz",
    - "@azure/spool-client": "https://www.myget.org/F/spool-sdk/auth/de20e499-3c4d-4204-bada-c209d6b770b6/npm/@azure/spool-client/-/0.1.4.tgz",
    - "@azure/spool-server": "https://www.myget.org/F/spool-sdk/auth/de20e499-3c4d-4204-bada-c209d6b770b6/npm/@azure/spool-server/-/0.1.4.tgz",
- Our **privacy needs** (can this reference documentation's metadata be exposed to the public? Does it need to be completely locked down from public consumption?)
  - *I think we need full privacy with the intent to publish the morning of Build, is that right?* 
- Your **target repository's location**
  - *That would be this fork for now - https://github.com/mikben/azure-docs-pr/tree/release-project-spool*

Robert will then loop back with any clarifying questions before passing the baton off to the vendor team who will generate our docs.