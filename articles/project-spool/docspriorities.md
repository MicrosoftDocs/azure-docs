*Note: This is a temporary page.  **This will not be published.***


### Docs Deliverables

1. A list of use-cases, ranked by priority. **[done]**
2. A Table of Contents, where each item contains a customer intent statement and an overview of the tasks covered within the item.  This Table of Contents should include (with a focus on CLI if possible):
   1. Overview
   2. Quickstarts
   3. Tutorials
   4. Samples - [CLI example](https://docs.microsoft.com/en-us/azure/app-service/samples-cli), RM, Azure PowerShell, Code Samples
   5. Concepts
   6. How-to guides
   7. Reference - PowerShell, PS Classic, .NET, REST... 
   8. Resources - REST, FAQ, Pricing Calculator, Quota, Regional Availability, Release Notes, StackOverflow, Troubleshooting
3. A Landing Page
4. An initial article set.  The focus is on quality here; we'll leverage templates when possible.  This should include:
  1. A reference from the Overview
  2. A quickstart
  3. A tutorial
  4. A sample for one platform / language  
5. Other article sets **[TBD]**

0
### Cold Backlog

- Determine how to auto-generate SDK API Reference Docs [Robert Outlaw gave me some pointers here].
   - > Our SDK generation is base off shipped packages such as NuGet or npm modules.  It's more or less as easy as you telling us what packages you have shipped, and we can generate docs for them. - R. Outlaw
- Determine how to auto-generate REST API Reference Docs [[instructions acquired](https://github.com/Azure/adx-documentation-pr/wiki)].


### Hot Backlog


1. `Add voice and video to your app in 15 mins!`
2. Scaffold our Table of Contents
3. Plug into Private Preview
4. Get samples running, study + tinker
5. Build a minimum-viable quickstart for this, including supporting reference, conceptual, and architecture materials.  Possibly including the corresponding sample in our demo app.  Get a feel for how long it takes to build out a MVP use-case from end-to-end.
6. With this time-cost awareness, plan out our other use-cases and content plan with weekly goals along the Private Preview / Build / General Availability timeline.


### Docs Weekly Digest

#### 3/5: 

- **Done**
  - Documented the process supporting [auto-generated reference documentation](https://review.docs.microsoft.com/en-us/azure/project-spool/automatingreferencedocs?branch=pr-en-us-104477). 
  - Fetched / built latest Spool samples per Scott Le

- **Planned**
  - Work on our first canonical scenario targeted at our canonical early adopter


#### 2/27: 

 - **Done**:
   - Scaffolding for our docs - I copied/pasted from [Spatial Anchors](https://docs.microsoft.com/en-us/azure/spatial-anchors/overview) to lay our docs foundation.
   - Guidance for [Spool Docs contributors](https://review.docs.microsoft.com/en-us/azure/project-spool/contribute?branch=pr-en-us-104477) is in place 
   - [Our MVP Canonical scenarios](https://review.docs.microsoft.com/en-us/azure/project-spool/canonicalscenarios?branch=pr-en-us-104477) have been identified
   - Joined developer TAP program / private preview
   - Investigated auto-generation of API docs (REST/SDK)
   - Started studying the Spool samples
 - **Planned**:
   - Test out the auto-generated PDFs for private preview users
   - Work on our first canonical scenario targeted at our canonical early adopter
 - **Impediments/Questions**:
   - Do you have any feedback on our docs priorities?
   - Do you have any feedback on our canonical scenarios we've selected?
   - Do you have any other feedback / questions for me?




