*Note: This is a temporary page.  **This will not be published.***

-- 

### Intro

We'll be working with Robert Outlaw's (routlaw) team to generate reference docs. 

The reference documentation types we need for Spool are:

- **REST Management** docs to support resource management (portal actions) via REST APIs. This is similar to the [Mixed Reality REST API doc set](https://docs.microsoft.com/en-us/rest/api/mixedreality/), the [Azure Media Services OpenAPI Swagger spec](https://docs.microsoft.com/en-us/azure/media-services/latest/), and the [Azure Media Services REST API spec](https://docs.microsoft.com/en-us/azure/media-services/latest/).
- **Azure CLI** docs to support resource management (portal actions) via the Azure CLI. This is similar to the [Azure Monitor CLI doc set](https://docs.microsoft.com/en-us/cli/azure/monitor?view=azure-cli-latest) and the [Azure Media Services CLI doc set](https://docs.microsoft.com/en-us/cli/azure/ams?view=azure-cli-latest).
- **C# Reference** docs to support the server and client C# SDKs. This is similar to the [Azure Notification Hubs .NET API docs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.notificationhubs?view=azure-dotnet).
- **JS Reference** docs to support the server and client JS SDKs. This is similar to the [Azure Blob Storage API reference docs](https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest)
- **Swift Reference** docs to support the server and client Swift SDKs. This is similar to the [Spatial Anchors Objective C SDK docs](https://docs.microsoft.com/en-us/objectivec/api/spatial-anchors/).
- **Java Reference** docs to support the server and client Java SDKs. This is similar to the [Azure Functions Java API docs](https://docs.microsoft.com/en-us/azure/azure-functions/)

The status and ownership of these reference docs are outlined in [this spreadsheet](https://microsoft.sharepoint-df.com/:x:/t/IC3SDK/EasbZy5MyMBLq2S0NyTNBVABhKiR6r8bq8Ld8clQQkgOeA?e=jxpgWn). This spreadsheet is being updated regularly as we approach public preview and GA.


#### Generating REST Management API Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


#### Generating Azure CLI Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


#### Generating C# SDK Reference Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


#### Generating JS SDK Reference Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


#### Generating Swift SDK Reference Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


#### Generating Java SDK Reference Docs

We want to give our customers something that looks like this: TODO

To do that... TODO


### Outstanding Risks / Concerns

- We may have some unique reference docs needs that may not be addressed by existing processes. (What are those needs?)
- How can we ensure that the pipelines across all platforms (from "raw material handoff" to "hosted reference docs") are fully tested well before we need our docs to be published?



### Mick's Notes

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

Every team's set of needs is unique, which means that we have a lot of processes available to us. These processes have been documented in several locations ([dev.azure](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/10/Welcome-and-Onboarding), [azure.github](https://azure.github.io/azure-sdk-for-net/), [github/azure](https://github.com/Azure/adx-documentation-pr/wiki), [review.docs](https://review.docs.microsoft.com/en-us/help/onboard/admin/reference/?branch=master)).
