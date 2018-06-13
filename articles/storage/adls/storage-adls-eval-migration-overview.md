Positioning for BlobFS/ADLSv2:

Azure Data Lake Storage (Preview) now directly integrated into the Azure Storage platform. Azure Data Lake Storage combines the scale and security capabilities of Azure Data Lake Store (ADLS) with the capabilities and low cost of Azure Blob Storage.

ADLSv2 includes rich support for the Hadoop Compatible File System along with a full hierarchical namespace optimized for analytics workloads. ADLSv2 is available in all 50 Azure regions and also includes all other capabilities of Azure’s Storage such as Blob API compatibility, data tiering and lifecycle management, durability options for HA and DR, eventgrid support, enhanced network security and a rich ecosystem of Storage partners.

For the preview phase we have developed migration guidance and tooling to help Azure Data Lake Store customers evaluate Azure Data Lake Storage and start planning a migration strategy as appropriate. The Azure CAT team will work closely with customers on developing this strategy.  Existing ADLS customers will be fully supported indefinitely on the existing ADLS platform allowing customers to plan their migration to ADLSv2 at their convenience. We must emphasize that while we recommend you begin evaluating and planning a migration now, we **do not** recommend actually migrating now. Azure Data Lake Storage is still a preview service.

Topics we recommend keeping in mind when proceeding through these evaluation and migration documents include:

* Does the service meet your needs for storing data intended for analytics?
* Do the supported migration paths meet your needs?
    * Distcp
    * AzCopy
* What migration patterns are recommended?
* Does the data access method fit your current workflow?
* Are the key features which you require currently in place?
* Do the current methods of securing your data meet your needs?
    * Encrypting Data at rest
    * ACLS (Coming soon)
* Are you dependent on any SDKs at the moment?
* Does your workflow use either PowerShell or CLI?
* What other ways do you interact with your analytics data beyond just the hadoop driver?


ADLSv2 will be available as a limited public preview in June with general availability in CY2018Q4. As a key customer of Azure we are interested in having you participate in a private preview so you can start to evaluate ADLSv2 and provide feedback through the private yammer.

Evaluation Overview for BlobFS:

•	Customers need to evaluate BlobFS to assess how directly the service meets their needs for storage of analytics data. This needs to occur to understand the similarities and, more importantly, the differences between ADLS & BlobFS from the perspective of each customer. The differences help assess the potential friction associated with eventually migrating to BlobFS. 
•	Start the evaluation by moving a small (or large) amount of data from your existing ADLS account to BlobFS. Data movement approaches:
o	Distcp
o	ADF
•	Learn how to access the data using the abfs protocol scheme
•	Take a series of applicable analytics jobs from your production environment, modify them to use the abfs scheme and run them against your BlobFS account. Assess the amount of work to modify the URIs in your analytics applications.
•	Think about the rest of the lifecycle of your analytics data and determine the equivalent features in BlobFS and the level of effort to adapt that functionality:
o	Securing data with ACLs
o	Setting lifecycle policies (BlobFS has multiple data tiers)
o	Encrypt your data at rest either using Microsoft supplied or your own keys
o	Protect network endpoints by applying VNet Firewalls/service tunneling
o	Backup your data
o	Other…
•	Control plane functionality
o	Provisioning & configuring accounts
o	Monitoring
o	Diagnostics
•	Think about other ways that you interact with your analytics data, beyond the Hadoop driver:
o	Bulk ingest via frameworks/tooling
o	Writing data using SDKs
o	Powershell, CLI

Next Steps:
•	Don’t attempt to migrate your analytics workloads yet! No matter how good a fit BlobFS might be, it is still a preview service and we don’t want you to rush into a premature migration effort.
•	Start to think about the scale of migrating your data and applications. Microsoft will be offering a broad range of tooling, support and guidance but you should still start thinking about what the migration effort is going to look like.
•	Think about how mitigation of issues arising during the evaluation phase might be handled. Again, Microsoft will support you though this process, but early identification of potential blocking or problematic areas will help.
•	Send us your feedback on BlobFS – good & bad.
