---
title: Azure and AWS services compared - multicloud | Microsoft Docs
description: See how Microsoft Azure cloud services compare to Amazon Web Services (AWS) for multicloud solutions or migration to Azure. Learn the IT capabilities of each.  
services: ''
documentationcenter: ''
keywords: cloud services comparison, cloud services compared, multicloud, compare azure aws, compare azure and aws, compare aws and azure, IT capabilities
author: lbrader
manager: christb

ms.assetid: 02488dea-711a-4618-8c51-667286008989
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/29/2016
ms.author: lbrader

---

# Microsoft Azure for AWS experts: Compare services for multicloud solutions and migration

This article helps you understand how Microsoft Azure services compare to Amazon Web Services (AWS). Whether you are planning a multicloud solution with Azure and AWS, or migrating to Azure, you can compare the IT capabilities of Azure and AWS services in all categories.

In the tables following, there are multiple Azure services listed for some AWS services. The Azure services are similar to one another, but depth and breadth of capabilities vary.

## Azure and AWS for multicloud solutions

As the leading public cloud platforms, Microsoft Azure and Amazon Web Services (AWS) each offer businesses a broad and deep set of capabilities with global coverage. Yet many organizations choose to use both platforms together for greater choice and flexibility, as well as to spread their risk and dependencies with a multicloud approach. Consulting companies and software vendors might also build on and use both Azure and AWS, as these platforms represent most of the cloud market demand.

For an overview of Azure for AWS users, see [Introduction to Azure for AWS experts](azure-for-aws-professionals.md).


## Compute services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Virtual servers|EC2|[Virtual Machines](https://azure.microsoft.com/services/virtual-machines/)|Virtual servers allow users to deploy, manage, and maintain OS and server software. Instance types provide combinations of CPU/RAM. Users pay for what they use with the flexibility to change sizes.|
|Container management|EC2 Container Service|[Container Service](http://azure.microsoft.com/services/container-service/)|A container management service that supports Docker containers and allows users to run applications on managed instance clusters. It eliminates the need to operate cluster management software or design fault-tolerant cluster architectures.|
|Web application|Elastic Beanstalk|- [Web Apps](https://azure.microsoft.com/services/app-service/web/) <br/>- [Cloud Services](https://azure.microsoft.com/services/cloud-services/)|A fully managed web infrastructure that provides the underlying web server instances and surrounding security, management, resilience, and shared storage capabilities.|
|Auto scale|Auto Scaling|- [VM Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) <br/>- [App Service AutoScaling](https://docs.microsoft.com/azure/app-service/app-service-environment-auto-scale)|Lets you automatically change the number of instances providing a particular compute workload. You set defined metric and thresholds that determine if the platform adds or removes instances.|
|Virtual server disk infrastructure|Elastic Block Store (EBS)|- [Page Blobs](https://docs.microsoft.com/azure/storage/storage-introduction#blob-storage) <br/>- [Premium Storage](https://docs.microsoft.com/azure/storage/storage-premium-storage)|Provides persistent, durable storage volumes for use with virtual machines, and offers the option to select different underlying physical storage types and performance characteristics.|
|Backend process logic|Lambda|- [Functions](https://azure.microsoft.com/services/functions/) <br/>- [Web Jobs](https://docs.microsoft.com/azure/app-service-web/web-sites-create-web-jobs) <br/>- [Logic Apps](https://azure.microsoft.com/services/logic-apps/) |Used to integrate systems and run backend processes in response to events or schedules without provisioning or managing servers.|
|Job-based applications|**&nbsp;**|[Batch](https://azure.microsoft.com/services/batch/)|Orchestration of the tasks and interactions between compute resources that are needed when you require processing across hundreds or thousands of compute nodes.|
|Microservice-based applications|**&nbsp;**|[Service Fabric](https://azure.microsoft.com/services/service-fabric/)|A compute service that orchestrates and manages the execution, lifetime, and resilience of complex, inter-related code components that can be either stateless or stateful.|
|API-based application runtime|**&nbsp;**|[API Apps](https://azure.microsoft.com/services/app-service/api/)|Build, manage, and host APIs enabling a variety of languages and SDKs with built-in authentication and analytics.|
|Disaster recovery|**&nbsp;**|[Site recovery](https://azure.microsoft.com/services/site-recovery/)|Automates protection and replication of virtual machines. Offers health monitoring, recovery plans, and recovery plan testing.|
|Predefined templates|AWS Quick Start|[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/)|Community-led templates for creating and deploying virtual machine-based solutions.|
|Marketplace|AWS Marketplace|[Azure Marketplace](https://azure.microsoft.com/marketplace/)|Easy-to-deploy and automatically configured third-party applications, including single virtual machine or multiple virtual machine solutions.|

## Storage and content delivery services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Object storage|S3|[Blob Storage](https://azure.microsoft.com/services/storage/blobs/)|Object storage service, for use cases including cloud applications, content distribution, backup, archiving, disaster recovery, and big data analytics.|
|Shared file storage|Elastic File System (Preview)|[File Storage](https://azure.microsoft.com/services/storage/files/)|Provides a simple interface to create and configure file systems quickly, and share common files. It’s shared file storage without the need for a supporting virtual machine, and can be used with traditional protocols that access files over a network.|
|Archiving and backup|N/A (software) <br/>Glacier and S3 (storage)|- [Backup (software)](https://azure.microsoft.com/services/backup/) <br/>- [Blob Storage (storage)](https://azure.microsoft.com/services/storage/blobs/)|Backup and archival solutions allow files and folders to be backed up and recovered from the cloud, and provides off-site protection against data loss. There are two components of backup software service that orchestrates backup/retrieval and the underlying backup storage infrastructure.|
|Hybrid storage|Storage Gateway|[StorSimple](https://azure.microsoft.com/services/storsimple/)|Integrates on-premises IT environments with cloud storage. Automates data management and storage, plus supports in disaster recovery.|
|Data transport|Import/Export Snowball|[Import/Export](https://azure.microsoft.com/pricing/details/storage-import-export/)|A data transport solution that uses secure disks and appliances to transfer large amounts of data. Also offers data protection during transit.|
|Content delivery|CloudFront|[Content Delivery Network](https://azure.microsoft.com/services/cdn/)|A global content delivery network that delivers audio, video, applications, images, and other files.|

## Databases

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Relational database|RDS|[SQL Database](https://azure.microsoft.com/services/sql-database/)|Relational database-as-a-service (DBaaS) where the database resilience, scale, and maintenance are primarily handled by the platform.|
|NoSQL database|DynamoDB|[DocumentDB](https://azure.microsoft.com/services/documentdb/)|A globally distributed NoSQL database service that supports elastically scaling throughput and storage across multiple regions, supports multiple well-defined consistency models, and is capable of automatically indexing data to serve SQL and MongoDB APIs.|
|Data warehouse|Redshift|[SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/) |A fully managed data warehouse that analyzes data using business intelligence tools. It can transact SQL queries across relational and non-relational data.|
|Table storage|DynamoDB <br/>SimpleDB|[Table Storage](https://azure.microsoft.com/services/storage/tables/)|A non-relational data store for semi-structured data. Developers store and query data items via web services requests.|
|Caching|ElastiCache|[Azure Redis Cache](https://azure.microsoft.com/services/cache/)|An in-memory based, distributed caching service that provides a high-performance store typically used to offload non-transactional work from a database.|
|Database migration|Database Migration Service (Preview)|[SQL Database Migration Wizard](https://sqlazuremw.codeplex.com/)|Typically is focused on the migration of database schema and data from one database format to a specific database technology in the cloud.|

## Networking services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Networking|Virtual Private Cloud|[Virtual Network](https://azure.microsoft.com/services/virtual-network/)|Provides an isolated, private environment in the cloud. Users have control over their virtual networking environment, including selection of their own IP address range, creation of subnets, and configuration of route tables and network gateways.|
|Domain name system (DNS)|Route 53|- [DNS](https://azure.microsoft.com/services/dns/) <br/>- [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)|A service that hosts domain names, plus routes users to Internet applications, connects user requests to datacenters, manages traffic to apps, and improves app availability with automatic failover.|
|Dedicated network|Direct Connect|[ExpressRoute](https://azure.microsoft.com/services/expressroute/)|Establishes a dedicated, private network connection from a location to the cloud provider (not over the Internet).|
|Load balancing|Elastic Load Balancing|- [Load Balancer](https://azure.microsoft.com/services/load-balancer/) <br/>- [Application Gateway](https://azure.microsoft.com/services/application-gateway/)|Automatically distributes incoming application traffic to add scale, handle failover, and route to a collection of resources.|

## Developer tools

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
| Development tools |AWS Toolkit for Microsoft Visual Studio <br/>AWS Toolkit for Eclipse | [Visual Studio](https://www.visualstudio.com/vs/azure-tools/)  |Development tools to help build, manage, and deploy cloud applications. |
| Dev-Test | Development and Test | [Development and Test](https://azure.microsoft.com/solutions/dev-test/)|  Creates consistent development and test environments through a scalable, on-demand infrastructure. |

## Management tools

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Deployment orchestration|OpsWorks <br/>CloudFormation|- [Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) <br/>- [Automation](https://azure.microsoft.com/services/automation/) <br/>- [VM extensions](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-extensions-features)|Configures and operates applications of all shapes and sizes, and provides templates to create and manage a collection of resources.|
|Management and monitoring|CloudWatch <br/>CloudTrail|- [Log Analytics](https://azure.microsoft.com/services/log-analytics/) <br/>- [Azure portal](https://azure.microsoft.com/features/azure-portal/) <br/>- [Application Insights](https://azure.microsoft.com/services/application-insights/)|Management and monitoring services for cloud resources and applications to collect, track, store, analyze, and deliver metrics and log files.|
|Optimization|Trusted Advisor|[Advisor (preview)](https://azure.microsoft.com/services/advisor)|Provides analysis of cloud resource configuration and security so subscribers can ensure they’re using best practices and optimum configurations.|
|Job scheduling|**&nbsp;**|[Scheduler](https://azure.microsoft.com/services/scheduler/)|Runs jobs on simple or complex recurring schedules—now, later, or recurring.|
|Catalog service|Service Catalog|**&nbsp;**|Creates and manages catalogs of approved IT services so users can quickly find and deploy them.|
|Administration|Config|[Azure portal (audit logs)](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit)|Provides resource inventory, configuration history, and configuration change notifications for security and governance.|
|Programmatic access|Command Line Interface|- [Azure Command Line Interface (CLI)](https://docs.microsoft.com/azure/xplat-cli-install) <br/>- [Azure PowerShell](https://docs.microsoft.com/azure/powershell-install-configure)|Built on top of the native REST API across all cloud services, various programming language-specific wrappers provide easier ways to create solutions.|

## Security and identity services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Authentication and authorization|Identity and Access Management <br/>Multi-Factor Authentication|- [Azure AD/Role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-what-is) <br/>- [Multi-Factor Authentication](https://azure.microsoft.com/services/multi-factor-authentication/)|Lets users securely control access to services and resources while offering data security and protection. Create and manage users and groups, and use permissions to allow and deny access to resources.|
|Encryption|Key Management Service <br/>CloudHSM|[Key Vault](https://azure.microsoft.com/services/key-vault/)|Creates, controls, and protects the encryption keys used to encrypt data. HSM provides hardware-based key storage.|
|Firewall|Web Application Firewall|[Web Application Firewall (preview)](https://docs.microsoft.com/azure/application-gateway/application-gateway-webapplicationfirewall-overview)|A firewall that protects web applications from common web exploits. Users can define customizable web security rules.|
|Security|Inspector (Preview)|[Security Center](https://azure.microsoft.com/services/security-center/) |An automated security assessment service that improves the security and compliance of applications. Automatically assess applications for vulnerabilities or deviations from best practices.|
|Directory|Directory Service|- [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) <br/>- [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) <br/>- [Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/)|Typically provides user/group properties that can be queried and used in applications. Also can provide capabilities to integrate to on-premises Active Directory services for single sign-on scenarios and SaaS management.|

## Analytics services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Big data processing|Elastic MapReduce (EMR)|[HDInsight](https://azure.microsoft.com/services/hdinsight/)|Supports technologies that break up large data processing tasks into multiple jobs, and then combine the results together to enable massive parallelism.|
|Data orchestration|Data Pipeline|[Data Factory](https://azure.microsoft.com/services/data-factory/)|Processes and moves data between different compute and storage services, as well as on-premises data sources at specified intervals. Users can create, schedule, orchestrate, and manage data pipelines.|
|Analytics|Kinesis Analytics (Preview)|- [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) <br/>- [Data Lake Analytics](https://azure.microsoft.com/services/data-lake-analytics/) <br/>- [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) |Storage and analysis platforms that creates insights from large quantities of data, or data that originates from many sources.|
|Visualization|QuickSight (Preview)|[PowerBI](https://powerbi.microsoft.com/)|Business intelligence tools that build visualizations, perform ad-hoc analysis, and develop business insights from data.|
|Machine learning|Machine Learning|[Machine Learning](https://azure.microsoft.com/services/machine-learning/)|Produces an end-to-end workflow to create, process, refine, and publish predictive models that can be used to understand what might happen from complex data sets.|
|Search|Elasticsearch Service|[Search](https://azure.microsoft.com/services/search/)|Delivers full-text search and related search analytics and capabilities.|
|Data discovery|**&nbsp;**|[Data Catalog](https://azure.microsoft.com/services/data-catalog/) |Provides the ability to better register, enrich, discover, understand, and consume data sources.|

## Mobile services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Pro app development|Mobile Hub (Beta) <br/>Cognito|[Mobile Apps](https://azure.microsoft.com/services/app-service/mobile/)|Backend mobile services for rapid development of mobile solutions, plus provide identity management, data synchronization, and storage and notifications across devices.|
|High-level app development|**&nbsp;**|[PowerApps](https://powerapps.microsoft.com/)|Model-driven application development for business applications with SaaS integration.|
|Analytics|Mobile Analytics|[Mobile Engagement](https://azure.microsoft.com/services/mobile-engagement/)|Provides real-time analytics from mobile apps data, highlights app users’ behavior, measures app usage, and tracks key trends.|
|Notification|Simple Notification Service|[Notification Hubs](https://azure.microsoft.com/services/notification-hubs/)|A push notification service that delivers messages instantly to applications or users. Messages can be sent to individual devices or can be broadcasted.|

## Application services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Email|Simple Email Service |&nbsp;|Lets users send transactional email, marketing messages, or any other type of content to customers.|
|Messaging|Simple Queue Service|- [Queue Storage](https://azure.microsoft.com/services/storage/queues/) <br/>- [Service Bus queues](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues) <br/>- [Service Bus topics](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions) <br/>- [Service Bus relay](https://docs.microsoft.com/azure/service-bus-relay/relay-what-is-it)|Stores large numbers of messages that can be accessed from anywhere through authenticated calls using HTTP or HTTPS. A queue can contain millions of messages, up to the total capacity limit of a storage account, and may also support more complex topologies such as publish/subscribe.|
|Workflow|Simple Workflow Service|[Logic Apps](https://azure.microsoft.com/services/logic-apps/)|A state tracker and task coordinator service that allows developers to build, run, and scale background activities using a visual processes flow creation.|
|App testing|Device Farm (Front End)|- [Xamarin Test Cloud (Front End)](https://www.xamarin.com/test-cloud) <br/>- [Azure DevTest Labs (Back End)](https://azure.microsoft.com/services/devtest-lab/)|A range of services geared toward the orchestration of dev/test backend server and service application infrastructure, as well as front-end client device and software testing and simulation.|
|API management|API Gateway|[API Management](https://azure.microsoft.com/services/api-management/)|Allows developers to create, publish, maintain, monitor, and secure APIs. Handles processing concurrent API calls, including traffic management, authorization, access control, monitoring, and API version management.|
|Application streaming|AppStream|[RemoteApp](https://www.remoteapp.windowsazure.com/Default.aspx)|Streams and delivers existing applications from the cloud to reach more users on more devices—without any code modifications.|
|Search|CloudSearch|[Search](https://azure.microsoft.com/services/search/)|Sets up, manages, and scales a search solution for websites and applications.|
|Media transcoding|Elastic Transcoder|[Encoding](https://azure.microsoft.com/services/media-services/encoding/)|A media transcoding service in the cloud that transcodes media files from their source format into versions that play back on devices such as smartphones, tablets, and PCs.|
|Streaming|**&nbsp;**|[Live and on-demand streaming](https://azure.microsoft.com/services/media-services/live-on-demand/)|Delivers content to virtually any device. Offers scalable streaming.|
|Others|**&nbsp;**|- [Media Player](https://azure.microsoft.com/services/media-services/media-player/) <br/>- [Media Indexer](https://azure.microsoft.com/services/media-services/media-indexer/) <br/>- [Content Protection](https://azure.microsoft.com/services/media-services/content-protection/)|Additional services related to the playing, protection, and analysis of the content within the media service.|

## Enterprise applications

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Productivity software|WorkSpaces <br/>WorkMail <br/>WorkDocs|[Office 365](https://products.office.com/)|Provides communication, collaboration, and document management services in the cloud.|

## Internet of things (IoT) services

|Subcategory|AWS Service|Azure Service|Description|
|--- |--- |--- |--- |
|Streaming data|Kinesis Firehose <br/>Kinesis Streams|[Event Hubs](https://azure.microsoft.com/services/event-hubs/)|Services that allow the mass ingestion of small data inputs, typically from devices and sensors, to process and route the data.|
|Internet of Things|IoT (Preview)|[IoT Hub](https://azure.microsoft.com/services/iot-hub/)|Lets connected devices interact with cloud applications and other devices to capture and analyze real-time data.|
