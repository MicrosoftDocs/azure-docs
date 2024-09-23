---
title: Reliability recommendations
description: Full list of available reliability recommendations in Advisor.
author: kanika1894
ms.author: kapasrij
ms.topic: article
ms.date: 08/29/2024
---

# Reliability recommendations

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. You can get reliability recommendations on the **Reliability** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Reliability** tab.


## AgFood Platform
<!--77f976ab-59e3-474d-ba04-32a7d41c9cb1_begin-->  
#### Upgrade to the latest ADMA DotNet SDK version  
  
We identified calls to an ADMA DotNet SDK version that is scheduled for deprecation. To ensure uninterrupted access to ADMA, latest features, and performance improvements, switch to the latest SDK version.  

For More information, see [What is Azure Data Manager for Agriculture?](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ)  
ID: 77f976ab-59e3-474d-ba04-32a7d41c9cb1  

<!--77f976ab-59e3-474d-ba04-32a7d41c9cb1_end-->

<!--1233e513-ac1c-402d-be94-7133dc37cac6_begin-->  
#### Upgrade to the latest ADMA Java SDK version  
  
We have identified calls to a ADMA Java Sdk version that is scheduled for deprecation. We recommend switching to the latest Sdk version to ensure uninterrupted access to ADMA, latest features, and performance improvements.  

For More information, see [What is Azure Data Manager for Agriculture?](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ)  
ID: 1233e513-ac1c-402d-be94-7133dc37cac6  

<!--1233e513-ac1c-402d-be94-7133dc37cac6_end-->
  

<!--c4ec2fa1-19f4-491f-9311-ca023ee32c38_begin-->  
#### Upgrade to the latest ADMA Python SDK version  
  
We identified calls to an ADMA Python SDK version that is scheduled for deprecation. To ensure uninterrupted access to ADMA, latest features, and performance improvements, switch to the latest SDK version.  

For More information, see [What is Azure Data Manager for Agriculture?](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ)  
ID: c4ec2fa1-19f4-491f-9311-ca023ee32c38  

<!--c4ec2fa1-19f4-491f-9311-ca023ee32c38_end-->
  

<!--9e49a43a-dbe2-477d-9d34-a4f209617fdb_begin-->  
#### Upgrade to the latest ADMA JavaScript SDK version  
  
We identified calls to an ADMA JavaScript SDK version that is scheduled for deprecation. To ensure uninterrupted access to ADMA, latest features, and performance improvements,  switch to the latest SDK version.  

For More information, see [What is Azure Data Manager for Agriculture?](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ)  
ID: 9e49a43a-dbe2-477d-9d34-a4f209617fdb  

<!--9e49a43a-dbe2-477d-9d34-a4f209617fdb_end-->
  
<!--microsoft_agfoodplatform_end--->
## API Management
<!--3dd24a8c-af06-49c3-9a04-fb5721d7a9bb_begin-->  
#### Migrate API Management service to stv2 platform  
  
Support for API Management instances hosted on the stv1 platform will be retired by 31 August 2024. Migrate to stv2 based platform before that to avoid service disruption.  

For More information, see [API Management stv1 platform retirement - Global Azure cloud (August 2024)](/azure/api-management/breaking-changes/stv1-platform-retirement-august-2024)  
ID: 3dd24a8c-af06-49c3-9a04-fb5721d7a9bb  

<!--3dd24a8c-af06-49c3-9a04-fb5721d7a9bb_end-->

<!--8962964c-a6d6-4c3d-918a-2777f7fbdca7_begin-->  
#### Hostname certificate rotation failed  
  
The API Management service failing to refresh the hostname certificate from the Key Vault can lead to the service using a stale certificate and runtime API traffic being blocked. Ensure that the certificate exists in the Key Vault, and the API Management service identity is granted secret read access.  

For More information, see [Configure a custom domain name for your Azure API Management instance](https://aka.ms/apimdocs/customdomain)  
ID: 8962964c-a6d6-4c3d-918a-2777f7fbdca7  

<!--8962964c-a6d6-4c3d-918a-2777f7fbdca7_end-->
  

<!--6124b23c-0d97-4098-9009-79e8c56cbf8c_begin-->  
#### The legacy portal was deprecated 3 years ago and retired in October 2023. However, we are seeing active usage of the portal which may cause service disruption soon when we disable it.  
  
We highly recommend that you migrate to the new developer portal as soon as possible to continue enjoying our services and take advantage of the new features and improvements.  

For More information, see [Migrate to the new developer portal](/previous-versions/azure/api-management/developer-portal-deprecated-migration)  
ID: 6124b23c-0d97-4098-9009-79e8c56cbf8c  

<!--6124b23c-0d97-4098-9009-79e8c56cbf8c_end-->
  

<!--53fd1359-ace2-4712-911c-1fc420dd23e8_begin-->  
#### Dependency network status check failed  
  
Azure API Management service dependency not available. Please, check virtual network configuration.  

For More information, see [Deploy your Azure API Management instance to a virtual network - external mode](https://aka.ms/apim-vnet-common-issues)  
ID: 53fd1359-ace2-4712-911c-1fc420dd23e8  

<!--53fd1359-ace2-4712-911c-1fc420dd23e8_end-->
  

<!--b7316772-5c8f-421f-bed0-d86b0f128e25_begin-->  
#### SSL/TLS renegotiation blocked  
  
SSL/TLS renegotiation attempt blocked; secure communication might fail. To support client certificate authentication scenarios, enable 'Negotiate client certificate' on listed hostnames. For browser-based clients, this option might result in a certificate prompt being presented to the client.  

For More information, see [How to secure APIs using client certificate authentication in API Management](/azure/api-management/api-management-howto-mutual-certificates-for-clients)  
ID: b7316772-5c8f-421f-bed0-d86b0f128e25  

<!--b7316772-5c8f-421f-bed0-d86b0f128e25_end-->
  

<!--2e4d65a3-1e77-4759-bcaa-13009484a97e_begin-->  
#### Deploy an Azure API Management instance to multiple Azure regions for increased service availability  
  
Azure API Management supports multi-region deployment, which enables API publishers to add regional API gateways to an existing API Management instance. Multi-region deployment helps reduce request latency perceived by geographically distributed API consumers and improves service availability.  

For More information, see [Deploy an Azure API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region)  
ID: 2e4d65a3-1e77-4759-bcaa-13009484a97e  

<!--2e4d65a3-1e77-4759-bcaa-13009484a97e_end-->
  

<!--f4c48f42-74f2-41bf-bf99-14e2f9ea9ac9_begin-->  
#### Enable and configure autoscale for API Management instance on production workloads.  
  
API Management instance in production service tiers can be scaled by adding and removing units. The autoscaling feature can dynamically adjust the units of an API Management instance to accommodate a change in load without manual intervention.  

For More information, see [Automatically scale an Azure API Management instance](https://aka.ms/apimautoscale)  
ID: f4c48f42-74f2-41bf-bf99-14e2f9ea9ac9  

<!--f4c48f42-74f2-41bf-bf99-14e2f9ea9ac9_end-->
  
<!--microsoft_apimanagement_end--->
## App Service
<!--1294987d-c97d-41d0-8fd8-cb6eab52d87b_begin-->  
#### Scale out your App Service plan to avoid CPU exhaustion  
  
High CPU utilization can lead to runtime issues with applications. Your application exceeded 90% CPU over the last couple of days. To reduce CPU usage and avoid runtime issues, scale out the application.  

For More information, see [Best practices for Azure App Service](https://aka.ms/antbc-cpu)  
ID: 1294987d-c97d-41d0-8fd8-cb6eab52d87b  

<!--1294987d-c97d-41d0-8fd8-cb6eab52d87b_end-->

<!--a85f5f1c-c01f-4926-84ec-700b7624af8c_begin-->  
#### Check your app's service health issues  
  
We have a recommendation related to your app's service health. Open the Azure Portal, go to the app, click the Diagnose and Solve to see more details.  

For More information, see [Best practices for Azure App Service](/azure/app-service/app-service-best-practices)  
ID: a85f5f1c-c01f-4926-84ec-700b7624af8c  

<!--a85f5f1c-c01f-4926-84ec-700b7624af8c_end-->
  

<!--b30897cc-2c2e-4677-a2a1-107ae982ff49_begin-->  
#### Fix the backup database settings of your App Service resource  
  
When an application has an invalid database configuration, its backups fail. For details, see your application's backup history on your app management page.  

For More information, see [Best practices for Azure App Service](https://aka.ms/antbc)  
ID: b30897cc-2c2e-4677-a2a1-107ae982ff49  

<!--b30897cc-2c2e-4677-a2a1-107ae982ff49_end-->
  

<!--80efd6cb-dcee-491b-83a4-7956e9e058d5_begin-->  
#### Fix the backup storage settings of your App Service resource  
  
When an application has invalid storage settings, its backups fail. For details, see your application's backup history on your app management page.  

For More information, see [Best practices for Azure App Service](https://aka.ms/antbc)  
ID: 80efd6cb-dcee-491b-83a4-7956e9e058d5  

<!--80efd6cb-dcee-491b-83a4-7956e9e058d5_end-->
  

<!--66d3137a-c4da-4c8a-b6b8-e03f5dfba66e_begin-->  
#### Scale up your App Service plan SKU to avoid memory problems  
  
The App Service Plan containing your application exceeded 85% memory allocation. High memory consumption can lead to runtime issues your applications. Find the problem application and  scale it up to a higher plan with more memory resources.  

For More information, see [Best practices for Azure App Service](https://aka.ms/antbc-memory)  
ID: 66d3137a-c4da-4c8a-b6b8-e03f5dfba66e  

<!--66d3137a-c4da-4c8a-b6b8-e03f5dfba66e_end-->
  

<!--45cfc38d-3ffd-4088-bb15-e4d0e1e160fe_begin-->  
#### Scale out your App Service plan  
  
Consider scaling out your App Service Plan to at least two instances to avoid cold start delays and service interruptions during routine maintenance.  

For More information, see [https://aka.ms/appsvcnuminstances](https://aka.ms/appsvcnuminstances)  
ID: 45cfc38d-3ffd-4088-bb15-e4d0e1e160fe  

<!--45cfc38d-3ffd-4088-bb15-e4d0e1e160fe_end-->
  

<!--3e35f804-52cb-4ebf-84d5-d15b3ab85dfc_begin-->  
#### Fix application code, a worker process crashed due to an unhandled exception  
  
A worker process in your application crashed due to an unhandled exception. To identify the root cause, collect memory dumps and call stack information at the time of the crash.  

For More information, see [https://aka.ms/appsvcproactivecrashmonitoring](https://aka.ms/appsvcproactivecrashmonitoring)  
ID: 3e35f804-52cb-4ebf-84d5-d15b3ab85dfc  

<!--3e35f804-52cb-4ebf-84d5-d15b3ab85dfc_end-->
  

<!--78c5ab69-858a-43ca-a5ac-4ca6f9cdc30d_begin-->  
#### Upgrade your App Service to a Standard plan to avoid request rejects  
  
When an application is part of a shared App Service plan and meets its quota multiple times, incoming requests might be rejected. Your web application can’t accept incoming requests after meeting a quota. To remove the quota, upgrade to a Standard plan.  

For More information, see [Azure App Service plan overview](https://aka.ms/ant-asp)  
ID: 78c5ab69-858a-43ca-a5ac-4ca6f9cdc30d  

<!--78c5ab69-858a-43ca-a5ac-4ca6f9cdc30d_end-->
  

<!--59a83512-d885-4f09-8e4f-c796c71c686e_begin-->  
#### Move your App Service resource to Standard or higher and use deployment slots  
  
When an application is deployed multiple times in a week, problems might occur. You deployed your application multiple times last week. To help you reduce deployment impact to your production web application, move your App Service resource to the Standard (or higher) plan, and use deployment slots.  

For More information, see [Set up staging environments in Azure App Service](https://aka.ms/ant-staging)  
ID: 59a83512-d885-4f09-8e4f-c796c71c686e  

<!--59a83512-d885-4f09-8e4f-c796c71c686e_end-->
  

<!--dc3edeee-f0ab-44ae-b612-605a0a739612_begin-->  
#### Consider upgrading the hosting plan of the Static Web App(s) in this subscription to Standard SKU.  
  
The combined bandwidth used by all the Free SKU Static Web Apps in this subscription is exceeding the monthly limit of 100GB. Consider upgrading these applications to Standard SKU to avoid throttling.  

For More information, see [Pricing – Static Web Apps ](https://azure.microsoft.com/pricing/details/app-service/static/)  
ID: dc3edeee-f0ab-44ae-b612-605a0a739612  

<!--dc3edeee-f0ab-44ae-b612-605a0a739612_end-->
  

<!--0dc165fd-69bf-468a-aa04-a69377b6feb0_begin-->  
#### Use deployment slots for your App Service resource  
  
When an application is deployed multiple times in a week, problems might occur. You deployed your application multiple times over the last week. To help you manage changes and help reduce deployment impact to your production web application, use deployment slots.  

For More information, see [Set up staging environments in Azure App Service](https://aka.ms/ant-staging)  
ID: 0dc165fd-69bf-468a-aa04-a69377b6feb0  

<!--0dc165fd-69bf-468a-aa04-a69377b6feb0_end-->
  

<!--6d732ac5-82e0-4a66-887e-eccee79a2063_begin-->  
#### CX Observer Personalized Recommendation  
  
CX Observer Personalized Recommendation  

  
ID: 6d732ac5-82e0-4a66-887e-eccee79a2063  

<!--6d732ac5-82e0-4a66-887e-eccee79a2063_end-->
  

<!--8be322ab-e38b-4391-a5f3-421f2270d825_begin-->  
#### Consider changing your application architecture to 64-bit  
  
Your App Service is configured as 32-bit, and its memory consumption is approaching the limit of 2 GB. If your application supports, consider recompiling your application and changing the App Service configuration to 64-bit instead.  

For More information, see [Application performance FAQs for Web Apps in Azure](https://aka.ms/appsvc32bit)  
ID: 8be322ab-e38b-4391-a5f3-421f2270d825  

<!--8be322ab-e38b-4391-a5f3-421f2270d825_end-->
  
<!--microsoft_web_end--->
## App Service Certificates
<!--a2385343-200c-4eba-bbe2-9252d3f1d6ea_begin-->  
#### Domain verification required to issue your App Service Certificate  
  
You have an App Service Certificate that's currently in a Pending Issuance status and requires domain verification. Failure to validate domain ownership will result in an unsuccessful certificate issuance. Domain verification isn't automated for App Service Certificates and will require action. If you've recently verified domain ownership and have been issued a certificate, you may disregard this message.  

For More information, see [Add and manage TLS/SSL certificates in Azure App Service](https://aka.ms/ASCDomainVerificationRequired)  
ID: a2385343-200c-4eba-bbe2-9252d3f1d6ea  

<!--a2385343-200c-4eba-bbe2-9252d3f1d6ea_end-->
<!--microsoft_certificateregistration_end--->
## Application Gateway
<!--6a2b1e70-bd4c-4163-86de-5243d7ac05ee_begin-->  
#### Upgrade your SKU or add more instances  
  
Deploying two or more medium or large sized instances ensures business continuity (fault tolerance) during outages caused by planned or unplanned maintenance.  

For More information, see [Multi-region load balancing - Azure Reference Architectures ](https://aka.ms/aa_gatewayrec_learnmore)  
ID: 6a2b1e70-bd4c-4163-86de-5243d7ac05ee  

<!--6a2b1e70-bd4c-4163-86de-5243d7ac05ee_end-->

<!--52a9d0a7-efe1-4512-9716-394abd4e0ab1_begin-->  
#### Avoid hostname override to ensure site integrity  
  
Avoid overriding the hostname when configuring Application Gateway. Having a domain on the frontend of Application Gateway different than the one used to access the backend, can lead to broken cookies or redirect URLs. Make sure the backend is able to deal with the domain difference, or update the Application Gateway configuration so the hostname doesn't need to be overwritten towards the backend. When used with App Service, attach a custom domain name to the Web App and avoid use of the *.azurewebsites.net host name towards the backend. Note that a different frontend domain isn't a problem in all situations, and certain categories of backends like REST APIs, are less sensitive in general.  

For More information, see [Troubleshoot App Service issues in Application Gateway](https://aka.ms/appgw-advisor-usecustomdomain)  
ID: 52a9d0a7-efe1-4512-9716-394abd4e0ab1  

<!--52a9d0a7-efe1-4512-9716-394abd4e0ab1_end-->
  

<!--17454550-1543-4068-bdaf-f3ed7cdd3d86_begin-->  
#### Implement ExpressRoute Monitor on Network Performance Monitor  
  
When ExpressRoute circuit isn't monitored by ExpressRoute Monitor on Network Performance, you miss notifications of loss, latency, and performance of on-premises to Azure resources, and Azure to on-premises resources. For end-to-end monitoring, implement ExpressRoute Monitor on Network Performance.  

For More information, see [Configure Network Performance Monitor for ExpressRoute (deprecated)](/azure/expressroute/how-to-npm)  
ID: 17454550-1543-4068-bdaf-f3ed7cdd3d86  

<!--17454550-1543-4068-bdaf-f3ed7cdd3d86_end-->
  

<!--70f87e66-9b2d-4bfa-ae38-1d7d74837689_begin-->  
#### Implement multiple ExpressRoute circuits in your Virtual Network for cross premises resiliency  
  
When an ExpressRoute gateway only has one ExpressRoute circuit associated to it, resiliency issues might occur. To ensure peering location redundancy and resiliency, connect one or more additional circuits to your gateway.  

For More information, see [Designing for high availability with ExpressRoute](/azure/expressroute/designing-for-high-availability-with-expressroute)  
ID: 70f87e66-9b2d-4bfa-ae38-1d7d74837689  

<!--70f87e66-9b2d-4bfa-ae38-1d7d74837689_end-->
  

<!--6cd70072-c45c-4716-bf7b-b35c18e46e72_begin-->  
#### Add at least one more endpoint to the profile, preferably in another Azure region  
  
Profiles need more than one endpoint to ensure availability if one of the endpoints fails. We also recommend that endpoints be in different regions.  

For More information, see [Traffic Manager endpoints](https://aka.ms/AA1o0x4)  
ID: 6cd70072-c45c-4716-bf7b-b35c18e46e72  

<!--6cd70072-c45c-4716-bf7b-b35c18e46e72_end-->
  

<!--0bbe0a49-3c63-49d3-ab4a-aa24198f03f7_begin-->  
#### Add an endpoint configured to "All (World)"  
  
For geographic routing, traffic is routed to endpoints in defined regions. When a region fails, there is no pre-defined failover. Having an endpoint where the Regional Grouping is configured to "All (World)" for geographic profiles avoids traffic black holing and guarantees service availablity.  

For More information, see [Add, disable, enable, delete, or move endpoints](https://aka.ms/Rf7vc5)  
ID: 0bbe0a49-3c63-49d3-ab4a-aa24198f03f7  

<!--0bbe0a49-3c63-49d3-ab4a-aa24198f03f7_end-->
  

<!--0db76759-6d22-4262-93f0-2f989ba2b58e_begin-->  
#### Add or move one endpoint to another Azure region  
  
All endpoints associated to this proximity profile are in the same region. Users from other regions may experience long latency when attempting to connect. Adding or moving an endpoint to another region will improve overall performance for proximity routing and provide better availability if all endpoints in one region fail.  

For More information, see [Configure the performance traffic routing method](https://aka.ms/Ldkkdb)  
ID: 0db76759-6d22-4262-93f0-2f989ba2b58e  

<!--0db76759-6d22-4262-93f0-2f989ba2b58e_end-->
  

<!--e070c4bf-afaf-413e-bc00-e476b89c5f3d_begin-->  
#### Move to production gateway SKUs from Basic gateways  
  
The Basic VPN SKU is for development or testing scenarios. If you're using the VPN gateway for production, move to a production SKU, which offers higher numbers of tunnels, Border Gateway Protocol (BGP), active-active configuration, custom IPsec/IKE policy, and increased stability and availability.  

For More information, see [About VPN Gateway configuration settings](https://aka.ms/aa_basicvpngateway_learnmore)  
ID: e070c4bf-afaf-413e-bc00-e476b89c5f3d  

<!--e070c4bf-afaf-413e-bc00-e476b89c5f3d_end-->
  

<!--c249dc0e-9a17-423e-838a-d72719e8c5dd_begin-->  
#### Enable Active-Active gateways for redundancy  
  
In active-active configuration, both instances of the VPN gateway establish site-to-site (S2S) VPN tunnels to your on-premise VPN device. When a planned maintenance or unplanned event happens to one gateway instance, traffic is automatically switched over to the other active IPsec tunnel.  

For More information, see [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](https://aka.ms/aa_vpnha_learnmore)  
ID: c249dc0e-9a17-423e-838a-d72719e8c5dd  

<!--c249dc0e-9a17-423e-838a-d72719e8c5dd_end-->
  

<!--1c7fc5ab-f776-4aee-8236-ab478519f68f_begin-->  
#### Disable health probes when there is only one origin in an origin group  
  
If you only have a single origin, Front Door always routes traffic to that origin even if its health probe reports an unhealthy status. The status of the health probe doesn't do anything to change Front Door's behavior. In this scenario, health probes don't provide a benefit.  

For More information, see [Best practices for Front Door](https://aka.ms/afd-disable-health-probes)  
ID: 1c7fc5ab-f776-4aee-8236-ab478519f68f  

<!--1c7fc5ab-f776-4aee-8236-ab478519f68f_end-->
  

<!--5185d64e-46fd-4ed2-8633-6d81f5e3ca59_begin-->  
#### Use managed TLS certificates  
  
When Front Door manages your TLS certificates, it reduces your operational costs, and helps you to avoid costly outages caused by forgetting to renew a certificate. Front Door automatically issues and rotates the managed TLS certificates.  

For More information, see [Best practices for Front Door](https://aka.ms/afd-use-managed-tls)  
ID: 5185d64e-46fd-4ed2-8633-6d81f5e3ca59  

<!--5185d64e-46fd-4ed2-8633-6d81f5e3ca59_end-->
  

<!--56f0c458-521d-4b8b-a704-c0a099483d19_begin-->  
#### Use NAT gateway for outbound connectivity  
  
Prevent connectivity failures due to source network address translation (SNAT) port exhaustion by using NAT gateway for outbound traffic from your virtual networks. NAT gateway scales dynamically and provides secure connections for traffic headed to the internet.  

For More information, see [Use Source Network Address Translation (SNAT) for outbound connections](/azure/load-balancer/load-balancer-outbound-connections#2-associate-a-nat-gateway-to-the-subnet)  
ID: 56f0c458-521d-4b8b-a704-c0a099483d19  

<!--56f0c458-521d-4b8b-a704-c0a099483d19_end-->
  

<!--5c488377-be3e-4365-92e8-09d1e8d9038c_begin-->  
#### Deploy your Application Gateway across Availability Zones  
  
Achieve zone redundancy by deploying Application Gateway across Availability Zones. Zone redundancy boosts resilience by enabling Application Gateway to survive various outages, which ensures continuity even if one zone is affected, and enhances overall reliability.  

For More information, see [Scaling Application Gateway v2 and WAF v2](https://aka.ms/appgw/az)  
ID: 5c488377-be3e-4365-92e8-09d1e8d9038c  

<!--5c488377-be3e-4365-92e8-09d1e8d9038c_end-->
  

<!--6cc8be07-8c03-4bd7-ad9b-c2985b261e01_begin-->  
#### Update VNet permission of Application Gateway users  
  
To improve security and provide a more consistent experience across Azure, all users must pass a permission check to create or update an Application Gateway in a Virtual Network. The users or service principals minimum permission required is Microsoft.Network/virtualNetworks/subnets/join/action.  

For More information, see [Application Gateway infrastructure configuration](https://aka.ms/agsubnetjoin)  
ID: 6cc8be07-8c03-4bd7-ad9b-c2985b261e01  

<!--6cc8be07-8c03-4bd7-ad9b-c2985b261e01_end-->
  

<!--79f543f9-60e6-4ef6-ae42-2095f6149cba_begin-->  
#### Use the same domain name on Front Door and your origin  
  
When you rewrite the Host header, request cookies and URL redirections might break. When you use platforms like Azure App Service, features like session affinity and authentication and authorization might not work correctly. Make sure to validate whether your application is going to work correctly.  

For More information, see [Best practices for Front Door](https://aka.ms/afd-same-domain-origin)  
ID: 79f543f9-60e6-4ef6-ae42-2095f6149cba  

<!--79f543f9-60e6-4ef6-ae42-2095f6149cba_end-->
  

<!--8d61a7d4-5405-4f43-81e3-8c6239b844a6_begin-->  
#### Implement Site Resiliency for ExpressRoute  
  
To ensure maximum resiliency, Microsoft recommends that you connect to two ExpressRoute circuits in two peering locations. The goal of Maximum Resiliency is to enhance availability and ensure the highest level of resilience for critical workloads.  

For More information, see [Design and architect Azure ExpressRoute for resiliency](https://aka.ms/ersiteresiliency)  
ID: 8d61a7d4-5405-4f43-81e3-8c6239b844a6  

<!--8d61a7d4-5405-4f43-81e3-8c6239b844a6_end-->
  

<!--c9af1ef6-55bc-48af-bfe4-2c80490159f8_begin-->  
#### Implement Zone Redundant ExpressRoute Gateways  
  
Implement zone-redundant Virtual Network Gateway in Azure Availability Zones. This brings resiliency, scalability, and higher availability to your Virtual Network Gateways.  

For More information, see [Create a zone-redundant virtual network gateway in availability zones](/azure/vpn-gateway/create-zone-redundant-vnet-gateway)  
ID: c9af1ef6-55bc-48af-bfe4-2c80490159f8  

<!--c9af1ef6-55bc-48af-bfe4-2c80490159f8_end-->
  

<!--c9c9750b-9ddb-436f-b19a-9c725539a0b5_begin-->  
#### Ensure autoscaling is used for increased performance and resiliency  
  
When configuring the Application Gateway, it's recommended to provision autoscaling to scale in and out in response to changes in demand. This helps to minimize the effects of a single failing component.  

For More information, see [Scaling Application Gateway v2 and WAF v2](/azure/application-gateway/application-gateway-autoscaling-zone-redundant)  
ID: c9c9750b-9ddb-436f-b19a-9c725539a0b5  

<!--c9c9750b-9ddb-436f-b19a-9c725539a0b5_end-->
  
<!--microsoft_network_end--->
## Application Gateway for Containers
<!--db83b3d4-96e5-4cfe-b736-b3280cadd163_begin-->  
#### Migrate to supported version of AGC  
  
The version of Application Gateway for Containers was provisioned with a preview version and is not supported for production. Ensure you provision a new gateway using the latest API version.  

For More information, see [What is Application Gateway for Containers?](https://aka.ms/appgwcontainers/docs)  
ID: db83b3d4-96e5-4cfe-b736-b3280cadd163  

<!--db83b3d4-96e5-4cfe-b736-b3280cadd163_end-->
<!--microsoft_servicenetworking_end--->
## Azure AI Search
<!--97b38421-f88c-4db0-b397-b2d81eff6630_begin-->  
#### Create a Standard search service (2GB)  
  
When you exceed your storage quota, indexing operations stop working. You're close to exceeding your storage quota of 2GB. If you need more storage, create a Standard search service or add extra partitions.  

For More information, see [https://aka.ms/azs/search-limits-quotas-capacity](https://aka.ms/azs/search-limits-quotas-capacity)  
ID: 97b38421-f88c-4db0-b397-b2d81eff6630  

<!--97b38421-f88c-4db0-b397-b2d81eff6630_end-->

<!--8d31f25f-31a9-4267-b817-20ee44f88069_begin-->  
#### Create a Standard search service (50MB)  
  
When you exceed your storage quota, indexing operations stop working. You're close to exceeding your storage quota of 50MB. To maintain operations, create a Basic or Standard search service.  

For More information, see [https://aka.ms/azs/search-limits-quotas-capacity](https://aka.ms/azs/search-limits-quotas-capacity)  
ID: 8d31f25f-31a9-4267-b817-20ee44f88069  

<!--8d31f25f-31a9-4267-b817-20ee44f88069_end-->
  

<!--b3efb46f-6d30-4201-98de-6492c1f8f10d_begin-->  
#### Avoid exceeding your available storage quota by adding more partitions  
  
When you exceed your storage quota, you can still query, but indexing operations stop working. You're close to exceeding your available storage quota. If you need more storage, add extra partitions.  

For More information, see [https://aka.ms/azs/search-limits-quotas-capacity](https://aka.ms/azs/search-limits-quotas-capacity)  
ID: b3efb46f-6d30-4201-98de-6492c1f8f10d  

<!--b3efb46f-6d30-4201-98de-6492c1f8f10d_end-->
  
<!--microsoft_search_end--->
## Azure Arc-enabled Kubernetes
<!--6d55ea5b-6e80-4313-9b80-83d384667eaa_begin-->  
#### Upgrade to the latest agent version of Azure Arc-enabled Kubernetes  
  
For the best Azure Arc enabled Kubernetes experience, improved stability and new functionality, upgrade to the latest agent version.  

For More information, see [Upgrade Azure Arc-enabled Kubernetes agents](https://aka.ms/ArcK8sAgentUpgradeDocs)  
ID: 6d55ea5b-6e80-4313-9b80-83d384667eaa  

<!--6d55ea5b-6e80-4313-9b80-83d384667eaa_end-->
<!--microsoft_kubernetes_end--->
## Azure Arc-enabled Kubernetes Configuration
<!--4bc7a00b-edbb-4963-8800-1b0f8897fecf_begin-->  
#### Upgrade Microsoft Flux extension to the newest major version  
  
The Microsoft Flux extension has a major version release. Plan for a manual upgrade to the latest major version for Microsoft Flux for all Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters within 6 months for continued support and new functionality.  

For More information, see [Available extensions for Azure Arc-enabled Kubernetes clusters](https://aka.ms/fluxreleasenotes)  
ID: 4bc7a00b-edbb-4963-8800-1b0f8897fecf  

<!--4bc7a00b-edbb-4963-8800-1b0f8897fecf_end-->

<!--79cfad72-9b6d-4215-922d-7df77e1ea3bb_begin-->  
#### Upcoming Breaking Changes for Microsoft Flux Extension  
  
The Microsoft Flux extension frequently receives updates for security and stability. The upcoming update, in line with the OSS Flux Project, will modify the HelmRelease and HelmChart APIs by removing deprecated fields. To avoid disruption to your workloads, necessary action is needed.  

For More information, see [Available extensions for Azure Arc-enabled Kubernetes clusters](https://aka.ms/fluxreleasenotes)  
ID: 79cfad72-9b6d-4215-922d-7df77e1ea3bb  

<!--79cfad72-9b6d-4215-922d-7df77e1ea3bb_end-->
  

<!--c8e3b516-a0d5-4c64-8a7a-71cfd068d5e8_begin-->  
#### Upgrade Microsoft Flux extension to a supported version  
  
Current version of Microsoft Flux on one or more Azure Arc enabled clusters and Azure Kubernetes clusters is out of support. To get security patches, bug fixes and Microsoft support, upgrade to a supported version.  

For More information, see [Available extensions for Azure Arc-enabled Kubernetes clusters](https://aka.ms/fluxreleasenotes)  
ID: c8e3b516-a0d5-4c64-8a7a-71cfd068d5e8  

<!--c8e3b516-a0d5-4c64-8a7a-71cfd068d5e8_end-->
  
<!--microsoft_kubernetesconfiguration_end--->
## Azure Arc-enabled servers
<!--9d5717d2-4708-4e3f-bdda-93b3e6f1715b_begin-->  
#### Upgrade to the latest version of the Azure Connected Machine agent  
  
The Azure Connected Machine agent is updated regularly with bug fixes, stability enhancements, and new functionality. For the best Azure Arc experience, upgrade your agent to the latest version.  

For More information, see [Managing and maintaining the Connected Machine agent](/azure/azure-arc/servers/manage-agent)  
ID: 9d5717d2-4708-4e3f-bdda-93b3e6f1715b  

<!--9d5717d2-4708-4e3f-bdda-93b3e6f1715b_end-->
<!--microsoft_hybridcompute_end--->
## Azure Cache for Redis
<!--7c380315-6ad9-4fb2-8930-a8aeb1d6241b_begin-->  
#### Increase fragmentation memory reservation  
  
Fragmentation and memory pressure can cause availability incidents. To help in reduce cache failures when running under high memory pressure, increase reservation of memory for fragmentation through the  maxfragmentationmemory-reserved setting available in the Advanced Settings options.  

For More information, see [How to configure Azure Cache for Redis](https://aka.ms/redis/recommendations/memory-policies)  
ID: 7c380315-6ad9-4fb2-8930-a8aeb1d6241b  

<!--7c380315-6ad9-4fb2-8930-a8aeb1d6241b_end-->

<!--c9e4a27c-79e6-4e4c-904f-b6612b6cd892_begin-->  
#### Configure geo-replication for Cache for Redis instances to increase durability of applications  
  
Geo-Replication enables disaster recovery for cached data, even in the unlikely event of a widespread regional failure. This can be essential for mission-critical applications. We recommend that you configure passive geo-replication for Premium Azure Cache for Redis instances.  

For More information, see [Configure passive geo-replication for Premium Azure Cache for Redis instances](https://aka.ms/redispremiumgeoreplication)  
ID: c9e4a27c-79e6-4e4c-904f-b6612b6cd892  

<!--c9e4a27c-79e6-4e4c-904f-b6612b6cd892_end-->
  
<!--microsoft_cache_end--->
## Azure Container Apps
<!--c692e862-953b-49fe-9c51-e5d2792c1cc1_begin-->  
#### Re-create your your Container Apps environment to avoid DNS issues  
  
There's a potential networking issue  with your Container Apps environments that might cause DNS issues. We recommend that you create a new Container Apps environment, re-create your Container Apps in the new environment, and delete the old Container Apps environment.  

For More information, see [Quickstart: Deploy your first container app using the Azure portal](https://aka.ms/createcontainerapp)  
ID: c692e862-953b-49fe-9c51-e5d2792c1cc1  

<!--c692e862-953b-49fe-9c51-e5d2792c1cc1_end-->

<!--b9ce2d2e-554b-4391-8ebc-91c570602b04_begin-->  
#### Renew custom domain certificate  
  
The custom domain certificate you uploaded is near expiration. To prevent possible service downtime, renew your certificate and upload the new certificate for your container apps.  

For More information, see [Custom domain names and bring your own certificates in Azure Container Apps](https://aka.ms/containerappcustomdomaincert)  
ID: b9ce2d2e-554b-4391-8ebc-91c570602b04  

<!--b9ce2d2e-554b-4391-8ebc-91c570602b04_end-->
  

<!--fa6c0880-da2e-42fd-9cb3-e1267ec5b5c2_begin-->  
#### An issue has been detected that is preventing the renewal of your Managed Certificate.  
  
We detected the managed certificate used by the Container App has failed to auto renew. Follow the documentation link to make sure that the DNS settings of your custom domain are correct.  

For More information, see [Custom domain names and free managed certificates in Azure Container Apps](https://aka.ms/containerapps/managed-certificates)  
ID: fa6c0880-da2e-42fd-9cb3-e1267ec5b5c2  

<!--fa6c0880-da2e-42fd-9cb3-e1267ec5b5c2_end-->
  

<!--9be5f344-6fa5-4abc-a1f2-61ae6192a075_begin-->  
#### Increase the minimal replica count for your containerized application  
  
The minimal replica count set for your Azure Container App containerized application might be too low, which can cause resilience, scalability, and load balancing issues. For better availability, consider increasing the minimal replica count.  

For More information, see [Set scaling rules in Azure Container Apps](https://aka.ms/containerappscalingrules)  
ID: 9be5f344-6fa5-4abc-a1f2-61ae6192a075  

<!--9be5f344-6fa5-4abc-a1f2-61ae6192a075_end-->
  
<!--microsoft_app_end--->
## Azure Cosmos DB
<!--5e4e9f04-9201-4fd9-8af6-a9539d13d8ec_begin-->  
#### Configure Azure Cosmos DB containers with a partition key  
  
When Azure Cosmos DB nonpartitioned collections reach their provisioned storage quota, you lose the ability to add data. Your Cosmos DB nonpartitioned collections are approaching their provisioned storage quota. Migrate these collections to new collections with a partition key definition so they can automatically be scaled out by the service.  

For More information, see [Partitioning and horizontal scaling in Azure Cosmos DB](/azure/cosmos-db/partitioning-overview#choose-partitionkey)  
ID: 5e4e9f04-9201-4fd9-8af6-a9539d13d8ec  

<!--5e4e9f04-9201-4fd9-8af6-a9539d13d8ec_end-->

<!--bdb595a4-e148-41f9-98e8-68ec92d1932e_begin-->  
#### Use static Cosmos DB client instances in your code and cache the names of databases and collections  
  
A high number of metadata operations on an account can result in rate limiting. Metadata operations have a system-reserved request unit (RU) limit. Avoid rate limiting from metadata operations by using static Cosmos DB client instances in your code and caching the names of databases and collections.  

For More information, see [Performance tips for Azure Cosmos DB and .NET SDK v2](/azure/cosmos-db/performance-tips)  
ID: bdb595a4-e148-41f9-98e8-68ec92d1932e  

<!--bdb595a4-e148-41f9-98e8-68ec92d1932e_end-->
  

<!--44a0a07f-23a2-49df-b8dc-a1b14c7c6a9d_begin-->  
#### Check linked Azure Key Vault hosting your encryption key  
  
When an Azure Cosmos DB account can't access its linked Azure Key Vault hosting the encyrption key, data access and security issues might happen. Your Azure Key Vault's configuration is preventing your Cosmos DB account from contacting the key vault to access your managed encryption keys. If you  recently performed a key rotation, ensure that the previous key, or key version, remains enabled and available until Cosmos DB completes the rotation. The previous key or key version can be disabled after 24 hours, or after the Azure Key Vault audit logs don't show any activity from Azure Cosmos DB on that key or key version.  

For More information, see [Configure customer-managed keys for your Azure Cosmos DB account with Azure Key Vault](/azure/cosmos-db/how-to-setup-cmk)  
ID: 44a0a07f-23a2-49df-b8dc-a1b14c7c6a9d  

<!--44a0a07f-23a2-49df-b8dc-a1b14c7c6a9d_end-->
  

<!--213974c8-ed9c-459f-9398-7cdaa3c28856_begin-->  
#### Configure consistent indexing mode on Azure Cosmos DB containers  
  
Azure Cosmos containers configured with the Lazy indexing mode update asynchronously, which improves write performance, but can impact query freshness. Your container is configured with the Lazy indexing mode. If query freshness is critical, use Consistent Indexing Mode for immediate index updates.  

For More information, see [Manage indexing policies in Azure Cosmos DB](/azure/cosmos-db/how-to-manage-indexing-policy)  
ID: 213974c8-ed9c-459f-9398-7cdaa3c28856  

<!--213974c8-ed9c-459f-9398-7cdaa3c28856_end-->
  

<!--bc9e5110-a220-4ab9-8bc9-53f92d3eef70_begin-->  
#### Hotfix - Upgrade to 2.6.14 version of the Async Java SDK v2 or to Java SDK v4  
  
There's a critical bug in version 2.6.13 (and lower) of the Azure Cosmos DB Async Java SDK v2 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. The error happens transparently to you by the service after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container. Note: While this is a critical hotfix for the Async Java SDK v2, we still highly recommend you migrate to the [Java SDK v4](/azure/cosmos-db/sql/sql-api-sdk-java-v4).  

For More information, see [Azure Cosmos DB Async Java SDK for API for NoSQL (legacy): Release notes and resources](/azure/cosmos-db/sql/sql-api-sdk-async-java)  
ID: bc9e5110-a220-4ab9-8bc9-53f92d3eef70  

<!--bc9e5110-a220-4ab9-8bc9-53f92d3eef70_end-->
  

<!--38942ae5-3154-4e0b-98d9-23aa061c334b_begin-->  
#### Critical issue - Upgrade to the current recommended version of the Java SDK v4  
  
There's a critical bug in version 4.15 and lower of the Azure Cosmos DB Java SDK v4 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. This happens transparently to you by the service after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container. Avoid this problem by upgrading to the current recommended version of the Java SDK v4  

For More information, see [Azure Cosmos DB Java SDK v4 for API for NoSQL: release notes and resources](/azure/cosmos-db/sql/sql-api-sdk-java-v4)  
ID: 38942ae5-3154-4e0b-98d9-23aa061c334b  

<!--38942ae5-3154-4e0b-98d9-23aa061c334b_end-->
  

<!--123039b5-0fda-4744-9a17-d6b5d5d122b2_begin-->  
#### Use the new 3.6+ endpoint to connect to your upgraded Azure Cosmos DB's API for MongoDB account  
  
Some of your applications are connecting to your upgraded Azure Cosmos DB's API for MongoDB account using the legacy 3.2 endpoint - [accountname].documents.azure.com. Use the new endpoint - [accountname].mongo.cosmos.azure.com (or its equivalent in sovereign, government, or restricted clouds).  

For More information, see [Azure Cosmos DB for MongoDB (4.0 server version): supported features and syntax](/azure/cosmos-db/mongodb-feature-support-40)  
ID: 123039b5-0fda-4744-9a17-d6b5d5d122b2  

<!--123039b5-0fda-4744-9a17-d6b5d5d122b2_end-->
  

<!--0da795d9-26d2-4f02-a019-0ec383363c88_begin-->  
#### Upgrade your Azure Cosmos DB API for MongoDB account to v4.2 to save on query/storage costs and utilize new features  
  
Your Azure Cosmos DB API for MongoDB account is eligible to upgrade to version 4.2. Upgrading to v4.2 can reduce your storage costs by up to 55% and your query costs by up to 45% by leveraging a new storage format. Numerous additional features such as multi-document transactions are also included in v4.2.  

For More information, see [Upgrade the API version of your Azure Cosmos DB for MongoDB account](/azure/cosmos-db/mongodb-version-upgrade)  
ID: 0da795d9-26d2-4f02-a019-0ec383363c88  

<!--0da795d9-26d2-4f02-a019-0ec383363c88_end-->
  

<!--ec6fe20c-08d6-43da-ac18-84ac83756a88_begin-->  
#### Enable Server Side Retry (SSR) on your Azure Cosmos DB's API for MongoDB account  
  
When an account is throwing a TooManyRequests error with the 16500 error code, enabling Server Side Retry (SSR) can help mitigate the issue.  

  
ID: ec6fe20c-08d6-43da-ac18-84ac83756a88  

<!--ec6fe20c-08d6-43da-ac18-84ac83756a88_end-->
  

<!--b57f7a29-dcc8-43de-86fa-18d3f9d3764d_begin-->  
#### Add a second region to your production workloads on Azure Cosmos DB  
  
Production workloads on Azure Cosmos DB run in a single region might have availability issues, this appears to be the case with some of your Cosmos DB accounts. Increase their availability by configuring them to span at least two Azure regions. NOTE: Additional regions incur additional costs.  

For More information, see [High availability (Reliability) in Azure Cosmos DB for NoSQL](/azure/cosmos-db/high-availability)  
ID: b57f7a29-dcc8-43de-86fa-18d3f9d3764d  

<!--b57f7a29-dcc8-43de-86fa-18d3f9d3764d_end-->
  

<!--51a4e6bd-5a95-4a41-8309-40f5640fdb8b_begin-->  
#### Upgrade old Azure Cosmos DB SDK to the latest version  
  
An Azure Cosmos DB account using an old version of the SDK lacks the latest fixes and improvements. Your Azure Cosmos DB account is using an old version of the SDK. For the latest fixes, performance improvements, and new feature capabilities, upgrade to the latest version.  

For More information, see [Azure Cosmos DB documentation](/azure/cosmos-db/)  
ID: 51a4e6bd-5a95-4a41-8309-40f5640fdb8b  

<!--51a4e6bd-5a95-4a41-8309-40f5640fdb8b_end-->
  

<!--60a55165-9ccd-4536-81f6-e8dc6246d3d2_begin-->  
#### Upgrade outdated Azure Cosmos DB SDK to the latest version  
  
An Azure Cosmos DB account using an old version of the SDK lacks the latest fixes and improvements. Your Azure Cosmos DB account is using an outdated version of the SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.  

For More information, see [Azure Cosmos DB documentation](/azure/cosmos-db/)  
ID: 60a55165-9ccd-4536-81f6-e8dc6246d3d2  

<!--60a55165-9ccd-4536-81f6-e8dc6246d3d2_end-->
  

<!--5de9f2e6-087e-40da-863a-34b7943beed4_begin-->  
#### Enable service managed failover for Cosmos DB account  
  
Enable service managed failover for Cosmos DB account to ensure high availability of the account. Service managed failover automatically switches the write region to the secondary region in case of a primary region outage. This ensures that the application continues to function without any downtime.  

For More information, see [High availability (Reliability) in Azure Cosmos DB for NoSQL](/azure/cosmos-db/high-availability)  
ID: 5de9f2e6-087e-40da-863a-34b7943beed4  

<!--5de9f2e6-087e-40da-863a-34b7943beed4_end-->
  

<!--64fbcac1-f652-4b6f-8170-2f97ffeb5631_begin-->  
#### Enable HA for your Production workload  
  
Many clusters with consistent workloads do not have high availability (HA) enabled. It's recommended to activate HA from the Scale page in the Azure Portal to prevent database downtime in case of unexpected node failures and to qualify for SLA guarantees.  

For More information, see [Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster](https://aka.ms/enableHAformongovcore)  
ID: 64fbcac1-f652-4b6f-8170-2f97ffeb5631  

<!--64fbcac1-f652-4b6f-8170-2f97ffeb5631_end-->
  

<!--8034b205-167a-4fd5-a133-0c8cb166103c_begin-->  
#### Enable zone redundancy for multi-region Cosmos DB accounts  
  
This recommendation suggests enabling zone redundancy for multi-region Cosmos DB accounts to improve high availability and reduce the risk of data loss in case of a regional outage.  

For More information, see [High availability (Reliability) in Azure Cosmos DB for NoSQL](/azure/cosmos-db/high-availability#replica-outages)  
ID: 8034b205-167a-4fd5-a133-0c8cb166103c  

<!--8034b205-167a-4fd5-a133-0c8cb166103c_end-->
  

<!--92056ca3-8fab-43d1-bebf-f9c377ef20e9_begin-->  
#### Add at least one data center in another Azure region  
  
Your Azure Managed Instance for Apache Cassandra cluster is designated as a production cluster but is currently deployed in a single Azure region. For production clusters, we recommend adding at least one more data center in another Azure region to guard against disaster recovery scenarios.  

For More information, see [Best practices for high availability and disaster recovery](/azure/managed-instance-apache-cassandra/resilient-applications)  
ID: 92056ca3-8fab-43d1-bebf-f9c377ef20e9  

<!--92056ca3-8fab-43d1-bebf-f9c377ef20e9_end-->
  

<!--a030f8ab-4dd4-4751-822b-f231a0df5f5a_begin-->  
#### Avoid being rate limited for Control Plane operation  
  
We found high number of Control Plane operations on your account through resource provider. Request that exceeds the documented limits at sustained levels over consecutive 5-minute periods may experience request being throttling as well failed or incomplete operation on Azure Cosmos DB resources.  

For More information, see [Azure Cosmos DB service quotas](https://docs.microsoft.com/azure/cosmos-db/concepts-limits#control-plane)  
ID: a030f8ab-4dd4-4751-822b-f231a0df5f5a  

<!--a030f8ab-4dd4-4751-822b-f231a0df5f5a_end-->
  
<!--microsoft_documentdb_end--->
## Azure Data Explorer
<!--fa2649e9-e1a5-4d07-9b26-51c080d9a9ba_begin-->  
#### Resolve virtual network issues  
  
Service failed to install or resume due to virtual network (VNet) issues. To resolve this issue, follow the steps in the troubleshooting guide.   

For More information, see [Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network](/azure/data-explorer/vnet-deploy-troubleshoot)  
ID: fa2649e9-e1a5-4d07-9b26-51c080d9a9ba  

<!--fa2649e9-e1a5-4d07-9b26-51c080d9a9ba_end-->

<!--f2bcadd1-713b-4acc-9810-4170a5d01dea_begin-->  
#### Add subnet delegation for 'Microsoft.Kusto/clusters'  
  
If a subnet isn’t delegated, the associated Azure service won’t be able to operate within it. Your subnet doesn’t have the required delegation. Delegate your subnet for 'Microsoft.Kusto/clusters'.  

For More information, see [What is subnet delegation?](/azure/virtual-network/subnet-delegation-overview)  
ID: f2bcadd1-713b-4acc-9810-4170a5d01dea  

<!--f2bcadd1-713b-4acc-9810-4170a5d01dea_end-->
  
<!--microsoft_kusto_end--->
## Azure Database for MySQL
<!--cf388b0c-2847-4ba9-8b07-54c6b23f60fb_begin-->  
#### High Availability - Add primary key to the table that currently doesn't have one.  
  
Our internal monitoring system has identified significant replication lag on the High Availability standby server. This lag is primarily caused by the standby server replaying relay logs on a table that lacks a primary key. To address this issue and adhere to best practices, it's recommended to add primary keys to all tables. Once this is done, proceed to disable and then re-enable High Availability to mitigate the problem.  

For More information, see [Troubleshoot replication latency in Azure Database for MySQL - Flexible Server](/azure/mysql/how-to-troubleshoot-replication-latency#no-primary-key-or-unique-key-on-a-table)  
ID: cf388b0c-2847-4ba9-8b07-54c6b23f60fb  

<!--cf388b0c-2847-4ba9-8b07-54c6b23f60fb_end-->

<!--fb41cc05-7ac3-4b0e-a773-a39b5c1ca9e4_begin-->  
#### Replication - Add a primary key to the table that currently doesn't have one  
  
Our internal monitoring observed significant replication lag on your replica server  because the replica server is replaying relay logs on a table that lacks a primary key. To ensure that the replica server can effectively synchronize with the primary and keep up with changes, add primary keys to the tables in the primary server and then recreate the replica server.  

For More information, see [Troubleshoot replication latency in Azure Database for MySQL - Flexible Server](/azure/mysql/how-to-troubleshoot-replication-latency#no-primary-key-or-unique-key-on-a-table)  
ID: fb41cc05-7ac3-4b0e-a773-a39b5c1ca9e4  

<!--fb41cc05-7ac3-4b0e-a773-a39b5c1ca9e4_end-->
  
<!--microsoft_dbformysql_end--->
## Azure Database for PostgreSQL
<!--33f26810-57d0-4612-85ff-a83ee9be884a_begin-->  
#### Remove inactive logical replication slots (important)  
  
Inactive logical replication slots can result in degraded server performance and unavailability due to write ahead log (WAL) file retention and buildup of snapshot files. Your Azure Database for PostgreSQL flexible server might have inactive logical replication slots. THIS NEEDS IMMEDIATE ATTENTION. Either delete the inactive replication slots, or start consuming the changes from these slots, so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.  

For More information, see [Logical replication and logical decoding in Azure Database for PostgreSQL - Flexible Server](https://aka.ms/azure_postgresql_flexible_server_logical_decoding)  
ID: 33f26810-57d0-4612-85ff-a83ee9be884a  

<!--33f26810-57d0-4612-85ff-a83ee9be884a_end-->

<!--6f33a917-418c-4608-b34f-4ff0e7be8637_begin-->  
#### Remove inactive logical replication slots  
  
When an Orcas PostgreSQL flexible server has inactive logical replication slots, degraded server performance and unavailability due to write ahead log (WAL) file retention and buildup of snapshot files might occur. THIS NEEDS IMMEDIATE ATTENTION. Either delete the inactive replication slots, or start consuming the changes from these slots, so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.  

For More information, see [Logical decoding](https://aka.ms/azure_postgresql_logical_decoding)  
ID: 6f33a917-418c-4608-b34f-4ff0e7be8637  

<!--6f33a917-418c-4608-b34f-4ff0e7be8637_end-->
  

<!--5295ed8a-f7a1-48d3-b4a9-e5e472cf1685_begin-->  
#### Configure geo redundant backup storage  
  
Configure GRS to ensure that your database meets its availability and durability targets even in the face of failures or disasters.  

For More information, see [Backup and restore in Azure Database for PostgreSQL - Flexible Server](https://aka.ms/PGGeoBackup)  
ID: 5295ed8a-f7a1-48d3-b4a9-e5e472cf1685  

<!--5295ed8a-f7a1-48d3-b4a9-e5e472cf1685_end-->
  

<!--eb241cd1-4bdc-4800-945b-4c9c8eeb6f07_begin-->  
#### Define custom maintenance windows to occur during low-peak hours  
  
When specifying preferences for the maintenance schedule, you can pick a day of the week and a time window. If you don't specify, the system will pick times between 11pm and 7am in your server's region time. Pick a day and time where usage is low.  

For More information, see [Scheduled maintenance in Azure Database for PostgreSQL - Flexible Server](https://aka.ms/PGCustomMaintenanceWindow)  
ID: eb241cd1-4bdc-4800-945b-4c9c8eeb6f07  

<!--eb241cd1-4bdc-4800-945b-4c9c8eeb6f07_end-->
  
<!--microsoft_dbforpostgresql_end--->
## Azure IoT Hub
<!--51b1fad8-4838-426f-9871-107bc089677b_begin-->  
#### Upgrade Microsoft Edge device runtime to a supported version for IoT Hub  
  
When Edge devices use outdated versions, performance degradation might occur. We recommend you upgrade to the latest supported version of the Azure IoT Edge runtime.  

For More information, see [Update IoT Edge](https://aka.ms/IOTEdgeSDKCheck)  
ID: 51b1fad8-4838-426f-9871-107bc089677b  

<!--51b1fad8-4838-426f-9871-107bc089677b_end-->

<!--d448c687-b808-4143-bbdc-02c35478198a_begin-->  
#### Upgrade device client SDK to a supported version for IotHub  
  
When devices use an outdated SDK, performance degradation can occur. Some or all of your devices are using an outdated SDK. We recommend you upgrade to a supported SDK version.  

For More information, see [Azure IoT Hub SDKs](https://aka.ms/iothubsdk)  
ID: d448c687-b808-4143-bbdc-02c35478198a  

<!--d448c687-b808-4143-bbdc-02c35478198a_end-->
  

<!--8d7efd88-c891-46be-9287-0aec2fabd51c_begin-->  
#### IoT Hub Potential Device Storm Detected  
  
This is when two or more devices are trying to connect to the IoT Hub using the same device ID credentials. When the second device (B) connects, it causes the first one (A) to become disconnected. Then (A) attempts to reconnect again, which causes (B) to get disconnected.  

For More information, see [Understand and resolve Azure IoT Hub errors](https://aka.ms/IotHubDeviceStorm)  
ID: 8d7efd88-c891-46be-9287-0aec2fabd51c  

<!--8d7efd88-c891-46be-9287-0aec2fabd51c_end-->
  

<!--d1ff97b9-44cd-4acf-a9d3-3af500bd79d6_begin-->  
#### Upgrade Device Update for IoT Hub SDK to a supported version  
  
When a Device Update for IoT Hub instance uses an outdated version of the SDK, it doesn't get the latest upgrades. For the latest fixes, performance improvements, and new feature capabilities, upgrade to the latest Device Update for IoT Hub SDK version.  

For More information, see [What is Device Update for IoT Hub?](/azure/iot-hub-device-update/understand-device-update)  
ID: d1ff97b9-44cd-4acf-a9d3-3af500bd79d6  

<!--d1ff97b9-44cd-4acf-a9d3-3af500bd79d6_end-->
  

<!--e4bda6ac-032c-44e0-9b40-e0522796a6d2_begin-->  
#### Add IoT Hub units or increase SKU level  
  
When an IoT Hub exceeds its daily message quota, operation and cost problems might occur. To ensure smooth operation in the future, add units or increase the SKU level.  

For More information, see [Understand and resolve Azure IoT Hub errors](/azure/iot-hub/troubleshoot-error-codes#403002-iothubquotaexceeded)  
ID: e4bda6ac-032c-44e0-9b40-e0522796a6d2  

<!--e4bda6ac-032c-44e0-9b40-e0522796a6d2_end-->
  
<!--microsoft_devices_end--->
## Azure Kubernetes Service (AKS)
<!--70829b1a-272b-4728-b418-8f1a56432d33_begin-->  
#### Enable Autoscaling for your system node pools  
  
To ensure your system pods are scheduled even during times of high load, enable autoscaling on your system node pool.  

For More information, see [Use the cluster autoscaler in Azure Kubernetes Service (AKS)](/azure/aks/cluster-autoscaler?tabs=azure-cli#before-you-begin)  
ID: 70829b1a-272b-4728-b418-8f1a56432d33  

<!--70829b1a-272b-4728-b418-8f1a56432d33_end-->

<!--a9228ae7-4386-41be-b527-acd59fad3c79_begin-->  
#### Have at least 2 nodes in your system node pool  
  
Ensure your system node pools have at least 2 nodes for reliability of your system pods. With a single node, your cluster can fail in the event of a node or hardware failure.  

For More information, see [Manage system node pools in Azure Kubernetes Service (AKS)](/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools)  
ID: a9228ae7-4386-41be-b527-acd59fad3c79  

<!--a9228ae7-4386-41be-b527-acd59fad3c79_end-->
  

<!--f31832f1-7e87-499d-a52a-120f610aba98_begin-->  
#### Create a dedicated system node pool  
  
A cluster without a dedicated system node pool is less reliable. We recommend you dedicate system node pools to only serve critical system pods, preventing resource starvation between system and competing user pods. Enforce this behavior with the CriticalAddonsOnly=true:NoSchedule taint on the pool.  

For More information, see [Manage system node pools in Azure Kubernetes Service (AKS)](/azure/aks/use-system-pools?tabs=azure-cli#before-you-begin)  
ID: f31832f1-7e87-499d-a52a-120f610aba98  

<!--f31832f1-7e87-499d-a52a-120f610aba98_end-->
  

<!--fac2ad84-1421-4dd3-8477-9d6e605392b4_begin-->  
#### Ensure B-series Virtual Machine's (VMs) aren't used in production environments  
  
When a cluster has one or more node pools using a non-recommended burstable VM SKU, full vCPU capability 100% is unguaranteed. Ensure B-series VM's aren't used in production environments.  

For More information, see [B-series burstable virtual machine sizes](/azure/virtual-machines/sizes-b-series-burstable)  
ID: fac2ad84-1421-4dd3-8477-9d6e605392b4  

<!--fac2ad84-1421-4dd3-8477-9d6e605392b4_end-->
  
<!--microsoft_containerservice_end--->
## Azure NetApp Files
<!--2e795f35-fce6-48dc-a5ac-6860cb9a0442_begin-->  
#### Configure AD DS Site for Azure Netapp Files AD Connector  
  
If Azure NetApp Files can't reach assigned AD DS site domain controllers, the domain controller discovery process queries all domain controllers. Unreachable domain controllers may be used, causing issues with volume creation, client queries, authentication, and AD connection modifications.  

For More information, see [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](https://aka.ms/anfsitescoping)  
ID: 2e795f35-fce6-48dc-a5ac-6860cb9a0442  

<!--2e795f35-fce6-48dc-a5ac-6860cb9a0442_end-->

<!--4e112555-7dc0-4f33-85e7-18398ac41345_begin-->  
#### Ensure Roles assigned to Microsoft.NetApp Delegated Subnet has Subnet Read Permissions  
  
Roles that are required for the management of Azure NetApp Files resources, must have "Microsoft.network/virtualNetworks/subnets/read" permissions on the subnet that is delegated to Microsoft.NetApp If the role, whether Custom or Built-In doesn't have this permission, then Volume Creations will fail  

  
ID: 4e112555-7dc0-4f33-85e7-18398ac41345  

<!--4e112555-7dc0-4f33-85e7-18398ac41345_end-->
  

<!--8754f0ed-c82a-497e-be31-c9d701c976e1_begin-->  
#### Review SAP configuration for timeout values used with Azure NetApp Files  
  
High availability of SAP while used with Azure NetApp Files relies on setting proper timeout values to prevent disruption to your application. Review the 'Learn more' link to ensure your configuration meets the timeout values as noted in the documentation.  

For More information, see [Use Azure to host and run SAP workload scenarios](/azure/sap/workloads/get-started)  
ID: 8754f0ed-c82a-497e-be31-c9d701c976e1  

<!--8754f0ed-c82a-497e-be31-c9d701c976e1_end-->
  

<!--cda11061-35a8-4ca3-aa03-b242dcdf7319_begin-->  
#### Implement disaster recovery strategies for your Azure NetApp Files resources  
  
To avoid data or functionality loss during a regional or zonal disaster, implement common disaster recovery techniques such as cross region replication or cross zone replication for your Azure NetApp Files volumes.  

For More information, see [Understand data protection and disaster recovery options in Azure NetApp Files](https://aka.ms/anfcrr)  
ID: cda11061-35a8-4ca3-aa03-b242dcdf7319  

<!--cda11061-35a8-4ca3-aa03-b242dcdf7319_end-->
  

<!--e4bebd74-387a-4a74-b757-475d2d1b4e3e_begin-->  
#### Azure Netapp Files - Enable Continuous Availability for SMB Volumes  
  
For Continuous Availability, we recommend enabling Server Message Block (SMB) volume for your Azure Netapp Files.  

For More information, see [Enable Continuous Availability on existing SMB volumes](https://aka.ms/anfdoc-continuous-availability)  
ID: e4bebd74-387a-4a74-b757-475d2d1b4e3e  

<!--e4bebd74-387a-4a74-b757-475d2d1b4e3e_end-->
  
<!--microsoft_netapp_end--->
## Azure Site Recovery
<!--3ebfaf53-4d8c-4e67-a948-017bbbf59de6_begin-->  
#### Enable soft delete for your Recovery Services vaults  
  
Soft delete helps you retain your backup data in the Recovery Services vault for an additional duration after deletion, giving you an opportunity to retrieve it before it's permanently deleted.  

For More information, see [Soft delete for Azure Backup](/azure/backup/backup-azure-security-feature-cloud)  
ID: 3ebfaf53-4d8c-4e67-a948-017bbbf59de6  

<!--3ebfaf53-4d8c-4e67-a948-017bbbf59de6_end-->

<!--9b1308f1-4c25-4347-a061-7cc5cd6a44ab_begin-->  
#### Enable Cross Region Restore for your recovery Services Vault  
  
Cross Region Restore (CRR) allows you to restore Azure VMs in a secondary region (an Azure paired region), helping with disaster recovery.  

For More information, see [How to restore Azure VM data in Azure portal](/azure/backup/backup-azure-arm-restore-vms#cross-region-restore)  
ID: 9b1308f1-4c25-4347-a061-7cc5cd6a44ab  

<!--9b1308f1-4c25-4347-a061-7cc5cd6a44ab_end-->
  
<!--microsoft_recoveryservices_end--->
## Azure Spring Apps
<!--39d862c8-445c-40c6-ba59-0e86134df606_begin-->  
#### Upgrade Application Configuration Service to Gen 2  
  
We notice you are still using Application Configuration Service Gen1 which will be end of support by April 2024. Application Configuration Service Gen2 provides better performance compared to Gen1 and the upgrade from Gen1 to Gen2 is zero downtime so we recommend to upgrade as soon as possible.  

For More information, see [Use Application Configuration Service for Tanzu](https://aka.ms/AsaAcsUpgradeToGen2)  
ID: 39d862c8-445c-40c6-ba59-0e86134df606  

<!--39d862c8-445c-40c6-ba59-0e86134df606_end-->
<!--microsoft_appplatform_end--->
## Azure SQL Database
<!--2ea11bcb-dfd0-48dc-96f0-beba578b989a_begin-->  
#### Enable cross region disaster recovery for SQL Database  
  
Enable cross region disaster recovery for Azure SQL Database for business continuity in the event of regional outage.  

For More information, see [Overview of business continuity with Azure SQL Database](https://aka.ms/sqldb_dr_overview)  
ID: 2ea11bcb-dfd0-48dc-96f0-beba578b989a  

<!--2ea11bcb-dfd0-48dc-96f0-beba578b989a_end-->

<!--807e58d0-e385-41ad-987b-4a4b3e3fb563_begin-->  
#### Enable zone redundancy for Azure SQL Database to achieve high availability and resiliency.  
  
To achieve high availability and resiliency, enable zone redundancy for the SQL database or elastic pool to use availability zones and ensure the database or elastic pool is resilient to zonal failures.  

For More information, see [Availability through redundancy -  Azure SQL Database](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell#zone-redundant-availability)  
ID: 807e58d0-e385-41ad-987b-4a4b3e3fb563  

<!--807e58d0-e385-41ad-987b-4a4b3e3fb563_end-->
  
<!--microsoft_sql_end--->
## Azure Stack HCI
<!--09e56b5a-9a00-47a7-82dd-9bd9569eb6ed_begin-->  
#### Upgrade to the latest version of AKS enabled by Arc  
  
Upgrade to the latest version of API/SDK of AKS enabled by Azure Arc for new functionality and improved stability.  

For More information, see [https://azure.github.io/azure-sdk/releases/latest/index.html](https://azure.github.io/azure-sdk/releases/latest/index.html)  
ID: 09e56b5a-9a00-47a7-82dd-9bd9569eb6ed  

<!--09e56b5a-9a00-47a7-82dd-9bd9569eb6ed_end-->

<!--2ac72093-309f-41ec-bf9d-55e9fc490563_begin-->  
#### Upgrade to the latest version of AKS enabled by Arc  
  
Upgrade to the latest version of API/SDK of AKS enabled by Azure Arc for new functionality and improved stability.  

For More information, see [https://azure.github.io/azure-sdk/releases/latest/index.html](https://azure.github.io/azure-sdk/releases/latest/index.html)  
ID: 2ac72093-309f-41ec-bf9d-55e9fc490563  

<!--2ac72093-309f-41ec-bf9d-55e9fc490563_end-->
  
<!--microsoft_azurestackhci_end--->
## Classic deployment model storage
<!--fd04ff97-d3b3-470a-9544-dfea3a5708db_begin-->  
#### Action required: Migrate classic storage accounts by 8/30/2024.  
  
Migrate your classic storage accounts to Azure Resource Manager to ensure business continuity. Azure Resource Manager will provide all of the same functionality plus a consistent management layer, resource grouping, and access to new features and updates.  

  
ID: fd04ff97-d3b3-470a-9544-dfea3a5708db  

<!--fd04ff97-d3b3-470a-9544-dfea3a5708db_end-->
<!--microsoft_classicstorage_end--->
## Classic deployment model virtual machine
<!--13ff4efb-6c84-4684-8838-52c123e3e3a2_begin-->  
#### Migrate off Cloud Services (classic) before 31 August 2024  
  
Cloud Services (classic) is retiring. To avoid any loss of data or business continuity, migrate off before 31 Aug 2024.  

For More information, see [Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)](https://aka.ms/ExternalRetirementEmailMay2022)  
ID: 13ff4efb-6c84-4684-8838-52c123e3e3a2  

<!--13ff4efb-6c84-4684-8838-52c123e3e3a2_end-->
<!--microsoft_classiccompute_end--->
## Cognitive Services
<!--13fed411-54aa-4923-b830-23b51539d79d_begin-->  
#### Upgrade your application to use the latest API version from Azure OpenAI  
  
An Azure OpenAI resource with an older API version lacks the latest features and functionalities. We recommend that you use the latest REST API version.  

For More information, see [Azure OpenAI Service REST API reference](/azure/cognitive-services/openai/reference)  
ID: 13fed411-54aa-4923-b830-23b51539d79d  

<!--13fed411-54aa-4923-b830-23b51539d79d_end-->

<!--3f83aee8-222d-445c-9a46-2af5fe5b4777_begin-->  
#### Quota exceeded for this resource, wait or upgrade to unblock  
  
If the quota for your resource is exceeded your resource becomes blocked. You can wait for the quota to automatically get replenished soon, or, to use the resource again now, upgrade it to a paid SKU.  

For More information, see [Plan and manage costs for Azure AI Studio](/azure/cognitive-services/plan-manage-costs#pay-as-you-go)  
ID: 3f83aee8-222d-445c-9a46-2af5fe5b4777  

<!--3f83aee8-222d-445c-9a46-2af5fe5b4777_end-->
  
<!--microsoft_cognitiveservices_end--->
## Container Registry
<!--af0cdbce-c610-499b-9bd7-b169cdb1bb2e_begin-->  
#### Use Premium tier for critical production workloads  
  
Premium registries provide the highest amount of included storage, concurrent operations and network bandwidth, enabling high-volume scenarios. The Premium tier also adds features such as geo-replication, availability zone support, content-trust, customer-managed keys and private endpoints.  

For More information, see [Azure Container Registry service tiers](https://aka.ms/AAqwyv6)  
ID: af0cdbce-c610-499b-9bd7-b169cdb1bb2e  

<!--af0cdbce-c610-499b-9bd7-b169cdb1bb2e_end-->

<!--dcfa2602-227e-4b6c-a60d-7b1f6514e690_begin-->  
#### Ensure Geo-replication is enabled for resilience  
  
Geo-replication enables workloads to use a single image, tag and registry name across regions, provides network-close registry access, reduced data transfer costs and regional Registry resilience if a regional outage occurs. This feature is only available in the Premium service tier.  

For More information, see [Geo-replication in Azure Container Registry](https://aka.ms/AAqwx90)  
ID: dcfa2602-227e-4b6c-a60d-7b1f6514e690  

<!--dcfa2602-227e-4b6c-a60d-7b1f6514e690_end-->
  
<!--microsoft_containerregistry_end--->
## Content Delivery Network
<!--ceecfd41-89b3-4c64-afe6-984c9cc03126_begin-->  
#### Azure CDN From Edgio, Managed Certificate Renewal Unsuccessful. Additional Validation Required.  
  
Azure CDN from Edgio employs CNAME delegation to renew certificates with DigiCert for managed certificate renewals. It's essential that Custom Domains resolve to an azureedge.net endpoint for the automatic renewal process with DigiCert to be successful. Ensure your Custom Domain's CNAME and CAA records are configured correctly. Should you require further assistance, please submit a support case to Azure to re-attempt the renewal request.  

  
ID: ceecfd41-89b3-4c64-afe6-984c9cc03126  

<!--ceecfd41-89b3-4c64-afe6-984c9cc03126_end-->

<!--4e1c2077-7c73-4ace-b4aa-f11b36c28290_begin-->  
#### Renew the expired Azure Front Door customer certificate to avoid service disruption  
  
When customer certificates for Azure Front Door Standard and Premium profiles expire, you might have service disruptions. To avoid service disruption, renew the certificate before it expires.  

For More information, see [Configure HTTPS on an Azure Front Door custom domain by using the Azure portal](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain#use-your-own-certificate)  
ID: 4e1c2077-7c73-4ace-b4aa-f11b36c28290  

<!--4e1c2077-7c73-4ace-b4aa-f11b36c28290_end-->
  

<!--bfe85fd2-ee53-4c35-8781-7790da2107e1_begin-->  
#### Re-validate domain ownership for the Azure Front Door managed certificate renewal  
  
Azure Front Door (AFD) can't automatically renew the managed certificate because the domain isn't CNAME mapped to AFD endpoint. For the managed certificate to be automatically renewed, revalidate domain ownership.  

For More information, see [Configure a custom domain on Azure Front Door by using the Azure portal](/azure/frontdoor/standard-premium/how-to-add-custom-domain#domain-validation-state)  
ID: bfe85fd2-ee53-4c35-8781-7790da2107e1  

<!--bfe85fd2-ee53-4c35-8781-7790da2107e1_end-->
  

<!--2c057605-4707-4d3e-bbb0-a7fe9b6a626b_begin-->  
#### Switch Secret version to 'Latest' for the Azure Front Door customer certificate  
  
Configure the Azure Front Door (AFD) customer certificate secret to 'Latest' for the AFD to refer to the latest secret version in Azure Key Vault, allowing the secret can be automatically rotated.  

For More information, see [Configure HTTPS on an Azure Front Door custom domain by using the Azure portal](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain#certificate-renewal-and-changing-certificate-types)  
ID: 2c057605-4707-4d3e-bbb0-a7fe9b6a626b  

<!--2c057605-4707-4d3e-bbb0-a7fe9b6a626b_end-->
  

<!--9411bc9f-d181-497c-b519-4154ae04fb00_begin-->  
#### Validate domain ownership by adding DNS TXT record to DNS provider  
  
Validate domain ownership by adding the DNS TXT record to your DNS provider. Validating domain ownership through TXT records enhances security and ensures proper control over your domain.  

For More information, see [Configure a custom domain on Azure Front Door by using the Azure portal](/azure/frontdoor/standard-premium/how-to-add-custom-domain#domain-validation-state)  
ID: 9411bc9f-d181-497c-b519-4154ae04fb00  

<!--9411bc9f-d181-497c-b519-4154ae04fb00_end-->
  
<!--microsoft_cdn_end--->
## Data Factory
<!--617ee02c-be69-441e-8294-dee5a237efff_begin-->  
#### Implement BCDR strategy for cross region redundancy in Azure Data Factory  
  
Implementing BCDR strategy improves high availability and reduced risk of data loss  

For More information, see [BCDR for Azure Data Factory and Azure Synapse Analytics pipelines - Azure Architecture Center ](https://aka.ms/AArn7ln)  
ID: 617ee02c-be69-441e-8294-dee5a237efff  

<!--617ee02c-be69-441e-8294-dee5a237efff_end-->

<!--939b97dc-fdca-4324-ba36-6ea7e1ab399b_begin-->  
#### Enable auto upgrade on your SHIR  
  
Auto-upgrade of Self-hosted Integration runtime has been disabled. Know that you aren't getting the latest changes and bug fixes on the Self-Hosted Integration runtime. Review them to enable the SHIR auto upgrade  

For More information, see [Self-hosted integration runtime auto-update and expire notification](https://aka.ms/shirexpirynotification)  
ID: 939b97dc-fdca-4324-ba36-6ea7e1ab399b  

<!--939b97dc-fdca-4324-ba36-6ea7e1ab399b_end-->
  
<!--microsoft_datafactory_end--->
## Fluid Relay
<!--a5e8a0f8-2c84-407a-b3d8-f371d684363b_begin-->  
#### Azure Fluid Relay client library should be upgraded  
  
If the Azure Fluid Relay service is invoked with an old client library, it might cause appplication problems. To ensure your application remains operational, upgrade your Azure Fluid Relay client library to the latest version. Upgrading provides the most up-to-date functionality, and enhancements in performance and stability.  

For More information, see [Version compatibility with Fluid Framework releases](/azure/azure-fluid-relay/concepts/version-compatibility)  
ID: a5e8a0f8-2c84-407a-b3d8-f371d684363b  

<!--a5e8a0f8-2c84-407a-b3d8-f371d684363b_end-->
<!--microsoft_fluidrelay_end--->
## HDInsight
<!--69740e3e-5b96-4b0e-b9b8-4d7573e3611c_begin-->  
#### Apply critical updates by dropping and recreating your HDInsight clusters (certificate rotation round 2)  
  
The HDInsight service attempted to apply a critical certificate update on your running clusters. However, due to some custom configuration changes, we're unable to apply the updates on all clusters. To prevent those clusters from becoming unhealthy and unusable, drop and recreate your clusters.  

For More information, see [Set up clusters in HDInsight with Apache Hadoop, Apache Spark, Apache Kafka, and more](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters)  
ID: 69740e3e-5b96-4b0e-b9b8-4d7573e3611c  

<!--69740e3e-5b96-4b0e-b9b8-4d7573e3611c_end-->

<!--24acd95e-fc9f-490c-b32d-edc6d747d0bc_begin-->  
#### Non-ESP ABFS clusters [Cluster Permissions for Word Readable]  
  
Plan to introduce a change in non-ESP ABFS clusters, which restricts non-Hadoop group users from running Hadoop commands for storage operations. This change is to improve cluster security posture. Customers need to plan for the updates before September 30, 2023.  

For More information, see [Azure HDInsight release notes](https://aka.ms/hdireleasenotes)  
ID: 24acd95e-fc9f-490c-b32d-edc6d747d0bc  

<!--24acd95e-fc9f-490c-b32d-edc6d747d0bc_end-->
  

<!--35e3a19f-16e7-4bb1-a7b8-49e02a35af2e_begin-->  
#### Restart brokers on your Kafka Cluster Disks  
  
When data disks used by Kafka brokers in  HDInsight clusters are almost full, the Apache Kafka broker process can't start and fails. To mitigate, find the retention time for every topic, back up the files that are older, and restart the brokers.  

For More information, see [Scenario: Brokers are unhealthy or can't restart due to disk space full issue](https://aka.ms/kafka-troubleshoot-full-disk)  
ID: 35e3a19f-16e7-4bb1-a7b8-49e02a35af2e  

<!--35e3a19f-16e7-4bb1-a7b8-49e02a35af2e_end-->
  

<!--41a248ef-50d4-4c48-81fb-13196f957210_begin-->  
#### Cluster Name length update  
  
The max length of cluster name will be changed to 45 from 59 characters, to improve the security posture of clusters. This change will be implemented by September 30th, 2023.  

For More information, see [Azure HDInsight release notes](/azure/hdinsight/hdinsight-release-notes)  
ID: 41a248ef-50d4-4c48-81fb-13196f957210  

<!--41a248ef-50d4-4c48-81fb-13196f957210_end-->
  

<!--8f163c95-0029-4139-952a-42bd0d773b93_begin-->  
#### Upgrade your cluster to the the latest HDInsight image  
  
A cluster created one year ago doesn't have the latest image upgrades. Your cluster was created 1 year ago. As part of the best practices, we recommend you use the latest HDInsight images for the best open source updates, Azure updates, and security fixes. The recommended maximum duration for cluster upgrades is less than six months.  

For More information, see [Consider the below points before starting to create a cluster.](/azure/hdinsight/hdinsight-overview-before-you-start#keep-your-clusters-up-to-date)  
ID: 8f163c95-0029-4139-952a-42bd0d773b93  

<!--8f163c95-0029-4139-952a-42bd0d773b93_end-->
  

<!--97355d8e-59ae-43ff-9214-d4acf728467a_begin-->  
#### Upgrade your HDInsight Cluster  
  
A cluster not using the latest image doesn't have the latest upgrades. Your cluster is not using the latest image. We recommend you use the latest versions of HDInsight images for the best of open source updates, Azure updates, and security fixes. HDInsight releases happen every 30 to 60 days.  

For More information, see [Azure HDInsight release notes](/azure/hdinsight/hdinsight-release-notes)  
ID: 97355d8e-59ae-43ff-9214-d4acf728467a  

<!--97355d8e-59ae-43ff-9214-d4acf728467a_end-->
  

<!--b3bf9f14-c83e-4dd3-8f5c-a6be746be173_begin-->  
#### Gateway or virtual machine not reachable  
  
We have detected a Network prob failure, it indicates unreachable gateway or a virtual machine. Verify all cluster hosts’ availability.  Restart virtual machine to recover. If you need further assistance, don't hesitate to contact Azure support for help.  

  
ID: b3bf9f14-c83e-4dd3-8f5c-a6be746be173  

<!--b3bf9f14-c83e-4dd3-8f5c-a6be746be173_end-->
  

<!--e4635832-0ab1-48b1-a386-c791197189e6_begin-->  
#### VM agent is 9.9.9.9. Upgrade the cluster.  
  
Our records indicate that one or more of your clusters are using images dated February 2022 or older (image versions 2202xxxxxx or older). 
There is a potential reliability issue on HDInsight clusters that use images dated February 2022 or older.Consider rebuilding your clusters with latest image.  

  
ID: e4635832-0ab1-48b1-a386-c791197189e6  

<!--e4635832-0ab1-48b1-a386-c791197189e6_end-->
  
<!--microsoft_hdinsight_end--->
## Media Services
<!--b7c9fd99-a979-40b4-ab48-b1dfab6bb41a_begin-->  
#### Increase Media Services quotas or limits  
  
When a media account hits its quota limits, disruption of service might occur. To avoid any disruption of service, review current usage of assets, content key policies, and stream policies and increase quota limits for the entities that are close to hitting the limit. You can request quota limits be increased by opening a ticket and adding relevant details. TIP: Don't create additional Azure Media accounts in an attempt to obtain higher limits.  

For More information, see [Azure Media Services quotas and limits](https://aka.ms/ams-quota-recommendation/)  
ID: b7c9fd99-a979-40b4-ab48-b1dfab6bb41a  

<!--b7c9fd99-a979-40b4-ab48-b1dfab6bb41a_end-->
<!--microsoft_media_end--->
## Service Bus
<!--29765e2c-5286-4039-963f-f8231e56cc3e_begin-->  
#### Use Service Bus premium tier for improved resilience  
  
When running critical applications, the Service Bus premium tier offers better resource isolation at the CPU and memory level, enhancing availability. It also supports Geo-disaster recovery feature enabling easier recovery from regional disasters without having to change application configurations.  

For More information, see [Service Bus premium messaging tier](https://aka.ms/asb-premium)  
ID: 29765e2c-5286-4039-963f-f8231e56cc3e  

<!--29765e2c-5286-4039-963f-f8231e56cc3e_end-->

<!--68e62f5c-4ed1-4b78-a2a0-4d9a4cebf106_begin-->  
#### Use Service Bus autoscaling feature in the premium tier for improved resilience  
  
When running critical applications, enabling the auto scale feature allows you to have enough capacity to handle the load on your application. Having the right amount of resources running can reduce throttling and provide a better user experience.  

For More information, see [Automatically update messaging units of an Azure Service Bus namespace](https://aka.ms/asb-autoscale)  
ID: 68e62f5c-4ed1-4b78-a2a0-4d9a4cebf106  

<!--68e62f5c-4ed1-4b78-a2a0-4d9a4cebf106_end-->
  
<!--microsoft_servicebus_end--->
## SQL Server on Azure Virtual Machines
<!--77f01e65-e57f-40ee-a0e9-e18c007d4d4c_begin-->  
#### Enable Azure backup for SQL on your virtual machines  
  
For the benefits of zero-infrastructure backup, point-in-time restore, and central management with SQL AG integration, enable backups for SQL databases on your virtual machines using Azure backup.  

For More information, see [About SQL Server Backup in Azure VMs](/azure/backup/backup-azure-sql-database)  
ID: 77f01e65-e57f-40ee-a0e9-e18c007d4d4c  

<!--77f01e65-e57f-40ee-a0e9-e18c007d4d4c_end-->
<!--microsoft_sqlvirtualmachine_end--->
## Storage
<!--d42d751d-682d-48f0-bc24-bb15b61ac4b8_begin-->  
#### Use Managed Disks for storage accounts reaching capacity limit  
  
When Premium SSD unmanaged disks in storage accounts are about to reach their Premium Storage capacity limit, failures might occur. To avoid failures when this limit is reached, migrate to Managed Disks that don't have an account capacity limit. This migration can be done through the portal in less than 5 minutes.  

For More information, see [Scalability and performance targets for standard storage accounts](https://aka.ms/premium_blob_quota)  
ID: d42d751d-682d-48f0-bc24-bb15b61ac4b8  

<!--d42d751d-682d-48f0-bc24-bb15b61ac4b8_end-->

<!--8ef907f4-f8e3-4bf1-962d-27e005a7d82d_begin-->  
#### Configure blob backup  
  
Azure blob backup helps protect data from accidental or malicious deletion. We recommend that you configure blob backup.  

For More information, see [Overview of Azure Blob backup](/azure/backup/blob-backup-overview)  
ID: 8ef907f4-f8e3-4bf1-962d-27e005a7d82d  

<!--8ef907f4-f8e3-4bf1-962d-27e005a7d82d_end-->
  
<!--microsoft_storage_end--->
## Subscriptions
<!--9e91a63f-faaf-46f2-ac7c-ddfcedf13366_begin-->  
#### Turn on Azure Backup to get simple, reliable, and cost-effective protection for your data  
  
Keep your information and applications safe with robust, one click backup from Azure.  Activate Azure Backup to get cost-effective protection for a wide range of workloads including VMs, SQL databases, applications, and file shares.  

For More information, see [Azure Backup Documentation - Azure Backup ](/azure/backup/)  
ID: 9e91a63f-faaf-46f2-ac7c-ddfcedf13366  

<!--9e91a63f-faaf-46f2-ac7c-ddfcedf13366_end-->

<!--242639fd-cd73-4be2-8f55-70478db8d1a5_begin-->  
#### Create an Azure Service Health alert  
  
Azure Service Health alerts keep you informed about issues and advisories in four areas (Service issues, Planned maintenance, Security and Health advisories). These alerts are personalized to notify you about disruptions or potential impacts on your chosen Azure regions and services.  

For More information, see [Create activity log alerts on service notifications using the Azure portal](https://aka.ms/aa_servicehealthalert_action)  
ID: 242639fd-cd73-4be2-8f55-70478db8d1a5  

<!--242639fd-cd73-4be2-8f55-70478db8d1a5_end-->
  
<!--microsoft_subscriptions_end--->
## Virtual Machines
<!--02cfb5ef-a0c1-4633-9854-031fbda09946_begin-->  
#### Improve data reliability by using Managed Disks  
  
Virtual machines in an Availability Set with disks that share either storage accounts or storage scale units aren't resilient to single storage scale unit failures during outages. Migrate to Azure Managed Disks to ensure that the disks of different VMs in the Availability Set are sufficiently isolated to avoid a single point of failure.  

For More information, see [https://aka.ms/aa_avset_manageddisk_learnmore](https://aka.ms/aa_avset_manageddisk_learnmore)  
ID: 02cfb5ef-a0c1-4633-9854-031fbda09946  

<!--02cfb5ef-a0c1-4633-9854-031fbda09946_end-->

<!--ed651749-cd37-4fd5-9897-01b416926745_begin-->  
#### Enable virtual machine replication to protect your applications from regional outage  
  
Virtual machines are resilient to regional outages when replication to another region is enabled. To reduce adverse business impact during an Azure region outage, we recommend enabling replication of all business-critical virtual machines.  

For More information, see [Quickstart: Set up disaster recovery to a secondary Azure region for an Azure VM](https://aka.ms/azure-site-recovery-dr-azure-vms)  
ID: ed651749-cd37-4fd5-9897-01b416926745  

<!--ed651749-cd37-4fd5-9897-01b416926745_end-->
  

<!--bcfeb92b-fe93-4cea-adc6-e747055518e9_begin-->  
#### Update your outbound connectivity protocol to Service Tags for Azure Site Recovery  
  
IP address-based allowlisting is a vulnerable way to control outbound connectivity for firewalls, Service Tags are a good  alternative. We highly recommend the use of Service Tags, to allow connectivity to Azure Site Recovery services for the machines.  

For More information, see [About networking in Azure VM disaster recovery](https://aka.ms/azure-site-recovery-using-service-tags)  
ID: bcfeb92b-fe93-4cea-adc6-e747055518e9  

<!--bcfeb92b-fe93-4cea-adc6-e747055518e9_end-->
  

<!--58d6648d-32e8-4346-827c-4f288dd8ca24_begin-->  
#### Upgrade the standard disks attached to your premium-capable VM to premium disks  
  
Using Standard SSD disks with premium VMs may lead to suboptimal performance and latency issues. We recommend that you consider upgrading the standard disks to premium disks. For any Single Instance Virtual Machine using premium storage for all Operating System Disks and Data Disks, we guarantee Virtual Machine Connectivity of at least 99.9%. When choosing to upgrade, there are two factors to consider. The first factor is that upgrading requires a VM reboot and that takes 3-5 minutes to complete. The second is if the VMs in the list are mission-critical production VMs, evaluate the improved availability against the cost of premium disks.  

For More information, see [Azure managed disk types](https://aka.ms/aa_storagestandardtopremium_learnmore)  
ID: 58d6648d-32e8-4346-827c-4f288dd8ca24  

<!--58d6648d-32e8-4346-827c-4f288dd8ca24_end-->
  

<!--57ecb3cd-f2b4-4cad-8b3a-232cca527a0b_begin-->  
#### Upgrade VM from Premium Unmanaged Disks to Managed Disks at no additional cost  
  
Azure Managed Disks provide higher resiliency, simplified service management, higher scale target and more choices among several disk types. Your VM is using premium unmanaged disks that can be migrated to managed disks at no additional cost through the portal in less than 5 minutes.  

For More information, see [Introduction to Azure managed disks](https://aka.ms/md_overview)  
ID: 57ecb3cd-f2b4-4cad-8b3a-232cca527a0b  

<!--57ecb3cd-f2b4-4cad-8b3a-232cca527a0b_end-->
  

<!--11f04d70-5bb3-4065-b717-1f11b2e050a8_begin-->  
#### Upgrade your deprecated Virtual Machine image to a newer image  
  
Virtual Machines (VMs) in your subscription are running on images scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image. To prevent disruption to your workloads, upgrade to a newer image. (VMRunningDeprecatedImage)  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 11f04d70-5bb3-4065-b717-1f11b2e050a8  

<!--11f04d70-5bb3-4065-b717-1f11b2e050a8_end-->
  

<!--937d85a4-11b2-4e13-a6b5-9e15e3d74d7b_begin-->  
#### Upgrade to a newer offer of Virtual Machine image  
  
Virtual Machines (VMs) in your subscription are running on images scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image.  To prevent disruption to your workloads, upgrade to a newer image. (VMRunningDeprecatedOfferLevelImage)  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 937d85a4-11b2-4e13-a6b5-9e15e3d74d7b  

<!--937d85a4-11b2-4e13-a6b5-9e15e3d74d7b_end-->
  

<!--681acf17-11c3-4bdd-8f71-da563c79094c_begin-->  
#### Upgrade to a newer SKU of Virtual Machine image  
  
Virtual Machines (VMs) in your subscription are running on images scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image.  To prevent disruption to your workloads, upgrade to a newer image.  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 681acf17-11c3-4bdd-8f71-da563c79094c  

<!--681acf17-11c3-4bdd-8f71-da563c79094c_end-->
  

<!--3b739bd1-c193-4bb6-a953-1362ee3b03b2_begin-->  
#### Upgrade your Virtual Machine Scale Set to alternative image version  
  
VMSS in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Set workloads would no longer scale out. Upgrade to newer version of the image to prevent disruption to your workload.  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 3b739bd1-c193-4bb6-a953-1362ee3b03b2  

<!--3b739bd1-c193-4bb6-a953-1362ee3b03b2_end-->
  

<!--3d18d7cd-bdec-4c68-9160-16a677d0f86a_begin-->  
#### Upgrade your Virtual Machine Scale Set to alternative image offer  
  
VMSS in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Set workloads would no longer scale out. To prevent disruption to your workload, upgrade to newer offer of the image.  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 3d18d7cd-bdec-4c68-9160-16a677d0f86a  

<!--3d18d7cd-bdec-4c68-9160-16a677d0f86a_end-->
  

<!--44abb62e-7789-4f2f-8001-fa9624cb3eb3_begin-->  
#### Upgrade your Virtual Machine Scale Set to alternative image SKU  
  
VMSS in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Set workloads would no longer scale out. To prevent disruption to your workload, upgrade to newer SKU of the image.  

For More information, see [Deprecated Azure Marketplace images - Azure Virtual Machines ](https://aka.ms/DeprecatedImagesFAQ)  
ID: 44abb62e-7789-4f2f-8001-fa9624cb3eb3  

<!--44abb62e-7789-4f2f-8001-fa9624cb3eb3_end-->
  

<!--53e0a3cb-3569-474a-8d7b-7fd06a8ec227_begin-->  
#### Provide access to mandatory URLs missing for your Azure Virtual Desktop environment  
  
For a session host to deploy and register to Windows Virtual Desktop (WVD) properly, you need a set of URLs in the 'allowed list' in case your VM runs in a restricted environment. For specific URLs missing from your allowed list, search your application event log for event 3702.  

For More information, see [Required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/safe-url-list)  
ID: 53e0a3cb-3569-474a-8d7b-7fd06a8ec227  

<!--53e0a3cb-3569-474a-8d7b-7fd06a8ec227_end-->
  

<!--00e4ac6c-afa3-4578-a021-5f15e18850a2_begin-->  
#### Align location of resource and resource group  
  
To reduce the impact of region outages, co-locate your resources with their resource group in the same region. This way, Azure Resource Manager stores metadata related to all resources within the group in one region. By co-locating, you reduce the chance of being affected by region unavailability.  

For More information, see [What is Azure Resource Manager?](/azure/azure-resource-manager/management/overview#resource-group-location-alignment)  
ID: 00e4ac6c-afa3-4578-a021-5f15e18850a2  

<!--00e4ac6c-afa3-4578-a021-5f15e18850a2_end-->
  

<!--066a047a-9ace-45f4-ac50-6325840a6b00_begin-->  
#### Use Availability zones for better resiliency and availability  
  
Availability Zones (AZ) in Azure help protect your applications and data from datacenter failures. Each AZ is made up of one or more datacenters equipped with independent power, cooling, and networking. By designing solutions to use zonal VMs, you can isolate your VMs from failure in any other zone.  

For More information, see [What are availability zones?](/azure/reliability/availability-zones-overview)  
ID: 066a047a-9ace-45f4-ac50-6325840a6b00  

<!--066a047a-9ace-45f4-ac50-6325840a6b00_end-->
  

<!--3b587048-b04b-4f81-aaed-e43793652b0f_begin-->  
#### Enable Azure Virtual Machine Scale Set (VMSS) application health monitoring  
  
Configuring Virtual Machine Scale Set application health monitoring using the Application Health extension or load balancer health probes enables the Azure platform to improve the resiliency of your application by responding to changes in application health.  

For More information, see [Using Application Health extension with Virtual Machine Scale Sets](https://aka.ms/vmss-app-health-monitoring)  
ID: 3b587048-b04b-4f81-aaed-e43793652b0f  

<!--3b587048-b04b-4f81-aaed-e43793652b0f_end-->
  

<!--651c7925-17a3-42e5-85cd-73bd095cf27f_begin-->  
#### Enable Backups on your Virtual Machines  
  
Secure your data by enabling backups for your virtual machines.  

For More information, see [What is the Azure Backup service?](/azure/backup/backup-overview)  
ID: 651c7925-17a3-42e5-85cd-73bd095cf27f  

<!--651c7925-17a3-42e5-85cd-73bd095cf27f_end-->
  

<!--b4d988a9-85e6-4179-b69c-549bdd8a55bb_begin-->  
#### Enable automatic repair policy on Azure Virtual Machine Scale Sets (VMSS)  
  
Enabling automatic instance repairs helps achieve high availability by maintaining a set of healthy instances. If an unhealthy instance is found by the Application Health extension or load balancer health probe, automatic instance repairs attempt to recover the instance by triggering repair actions.  

For More information, see [Automatic instance repairs for Azure Virtual Machine Scale Sets](https://aka.ms/vmss-automatic-repair)  
ID: b4d988a9-85e6-4179-b69c-549bdd8a55bb  

<!--b4d988a9-85e6-4179-b69c-549bdd8a55bb_end-->
  

<!--ce8bb934-ce5c-44b3-a94c-1836fa7a269a_begin-->  
#### Configure Virtual Machine Scale Set automated scaling by metrics  
  
Optimize resource utilization, reduce costs, and enhance application performance with custom autoscale based on a metric. Automatically add Virtual Machine instances based on real-time metrics such as CPU, memory, and disk operations. Ensure high availability while maintaining cost-efficiency.  

For More information, see [Overview of autoscale with Azure Virtual Machine Scale Sets](https://aka.ms/VMSSCustomAutoscaleMetric)  
ID: ce8bb934-ce5c-44b3-a94c-1836fa7a269a  

<!--ce8bb934-ce5c-44b3-a94c-1836fa7a269a_end-->
  

<!--d4102c0f-ebe3-4b22-8fe0-e488866a87af_begin-->  
#### Use Azure Disks with Zone Redundant Storage (ZRS) for higher resiliency and availability  
  
Azure Disks with ZRS provide synchronous replication of data across three Availability Zones in a region, making the disk tolerant to zonal failures without disruptions to applications. For higher resiliency and availability, migrate disks from LRS to ZRS.  

For More information, see [Convert a disk from LRS to ZRS](https://aka.ms/migratedisksfromLRStoZRS)  
ID: d4102c0f-ebe3-4b22-8fe0-e488866a87af  

<!--d4102c0f-ebe3-4b22-8fe0-e488866a87af_end-->
  
<!--microsoft_compute_end--->
## Workloads
<!--3ca22452-0f8f-4701-a313-a2d83334e3cc_begin-->  
#### Configure an Always On availability group for Multi-purpose SQL servers (MPSQL)  
  
MPSQL servers with an Always On availability group have better availability. Your MPSQL servers aren't configured as part of an Always On availability group in the shared infrastructure in your Epic system. Always On availability groups improve database availability and resource use.  

For More information, see [What is an Always On availability group?](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server?view=sql-server-ver16#Benefits)  
ID: 3ca22452-0f8f-4701-a313-a2d83334e3cc  

<!--3ca22452-0f8f-4701-a313-a2d83334e3cc_end-->

<!--f3d23f88-aee2-4b5a-bfd6-65b22bd70fc0_begin-->  
#### Configure Local host cache on Citrix VDI servers to ensure seamless connection brokering operations  
  
We have observed that your Citrix VDI servers aren't configured Local host Cache. Local Host Cache (LHC) is a feature in Citrix Virtual Apps and Desktops that allows connection brokering operations to continue when an outage occurs.LHC engages when the site database is inaccessible for 90 seconds.  

  
ID: f3d23f88-aee2-4b5a-bfd6-65b22bd70fc0  

<!--f3d23f88-aee2-4b5a-bfd6-65b22bd70fc0_end-->
  

<!--dfa50c39-104a-418b-873a-c145fe521c9b_begin-->  
#### Deploy Hyperspace Web servers as part of a Virtual Machine Scale Set Flex configured for 3 zones  
  
We have observed that your Hyperspace Web servers in the Virtual Machine Scale Set Flex set up aren't spread across 3 zones in the selected region. For services like Hyperspace Web in Epic systems that require high availability and large scale, it's recommended that servers are deployed as part of Virtual Machine Scale Set Flex and spread across 3 zones. With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem   

For More information, see [Create a Virtual Machine Scale Set that uses Availability Zones](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones?tabs=cli-1%2Cportal-2)  
ID: dfa50c39-104a-418b-873a-c145fe521c9b  

<!--dfa50c39-104a-418b-873a-c145fe521c9b_end-->
  

<!--45c2994f-a01d-4024-843e-a2a84dae48b4_begin-->  
#### Set the Idle timeout in Azure Load Balancer to 30 minutes for ASCS HA setup in SAP workloads  
  
To prevent load balancer timeout, make sure that all Azure Load Balancing Rules have: 'Idle timeout (minutes)' set to the maximum value of 30 minutes. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable the setting.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: 45c2994f-a01d-4024-843e-a2a84dae48b4  

<!--45c2994f-a01d-4024-843e-a2a84dae48b4_end-->
  

<!--aec9b9fb-145f-4af8-94f3-7fdc69762b72_begin-->  
#### Enable Floating IP in the Azure Load balancer for ASCS HA setup in SAP workloads  
  
For port resuse and better high availability, enable floating IP in the load balancing rules for the Azure Load Balancer for HA set up of ASCS instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: aec9b9fb-145f-4af8-94f3-7fdc69762b72  

<!--aec9b9fb-145f-4af8-94f3-7fdc69762b72_end-->
  

<!--c3811f93-a1a5-4a84-8fba-dd700043cc42_begin-->  
#### Enable HA ports in the Azure Load Balancer for ASCS HA setup in SAP workloads  
  
For port resuse and better high availability, enable HA ports in the load balancing rules for HA set up of ASCS instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: c3811f93-a1a5-4a84-8fba-dd700043cc42  

<!--c3811f93-a1a5-4a84-8fba-dd700043cc42_end-->
  

<!--27899d14-ac62-41f4-a65d-e6c2a5af101b_begin-->  
#### Disable TCP timestamps on VMs placed behind Azure Load Balancer in ASCS HA setup in SAP workloads  
  
Disable TCP timestamps on VMs placed behind AzurEnabling TCP timestamps will cause the health probes to fail due to TCP packets being dropped by the VM's guest OS TCP stack causing the load balancer to mark the endpoint as down  

For More information, see [https://launchpad.support.sap.com/#/notes/2382421](https://launchpad.support.sap.com/#/notes/2382421)  
ID: 27899d14-ac62-41f4-a65d-e6c2a5af101b  

<!--27899d14-ac62-41f4-a65d-e6c2a5af101b_end-->
  

<!--1c1deb1c-ae1b-49a7-88d3-201285ad63b6_begin-->  
#### Set the Idle timeout in Azure Load Balancer to 30 minutes for HANA DB HA setup in SAP workloads  
  
To prevent load balancer timeout, ensure that all Azure Load Balancing Rules 'Idle timeout (minutes)' parameter is set to the maximum value of 30 minutes. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable the recommended settings.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: 1c1deb1c-ae1b-49a7-88d3-201285ad63b6  

<!--1c1deb1c-ae1b-49a7-88d3-201285ad63b6_end-->
  

<!--cca36756-d938-4f3a-aebf-75358c7c0622_begin-->  
#### Enable Floating IP in the Azure Load balancer for HANA DB HA setup in SAP workloads  
  
For more flexible routing, enable floating IP in the load balancing rules for the Azure Load Balancer for HA set up of HANA DB instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable the recommended settings.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: cca36756-d938-4f3a-aebf-75358c7c0622  

<!--cca36756-d938-4f3a-aebf-75358c7c0622_end-->
  

<!--a5ac35c2-a299-4864-bfeb-09d2348bda68_begin-->  
#### Enable HA ports in the Azure Load Balancer for HANA DB HA setup in SAP workloads  
  
For enhanced scalability, enable HA ports in the Load balancing rules for HA set up of HANA DB instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add or edit the rule to enable the recommended settings.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability#:~:text=To%20set%20up%20standard%20load%20balancer%2C%20follow%20these%20configuration%20steps)  
ID: a5ac35c2-a299-4864-bfeb-09d2348bda68  

<!--a5ac35c2-a299-4864-bfeb-09d2348bda68_end-->
  

<!--760ba688-69ea-431b-afeb-13683a03f0c2_begin-->  
#### Disable TCP timestamps on VMs placed behind Azure Load Balancer in HANA DB HA setup in SAP workloads  
  
Disable TCP timestamps on VMs placed behind Azure Load Balancer. Enabling TCP timestamps causes the health probes to fail due to TCP packets dropped by the VM's guest OS TCP stack causing the load balancer to mark the endpoint as down.  

For More information, see [Azure Load Balancer health probes](/azure/load-balancer/load-balancer-custom-probe-overview#:~:text=Don%27t%20enable%20TCP,must%20be%20disabled)  
ID: 760ba688-69ea-431b-afeb-13683a03f0c2  

<!--760ba688-69ea-431b-afeb-13683a03f0c2_end-->
  

<!--28a00e1e-d0ad-452f-ad58-95e6c584e594_begin-->  
#### Ensure that stonith is enabled for the Pacemaker configuration in ASCS HA setup in SAP workloads  
  
In a Pacemaker cluster, the implementation of node level fencing is done using a STONITH (Shoot The Other Node in the Head) resource. To help manage failed nodes, ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 28a00e1e-d0ad-452f-ad58-95e6c584e594  

<!--28a00e1e-d0ad-452f-ad58-95e6c584e594_end-->
  

<!--deede7ea-68c5-4fb9-8f08-5e706f88ac67_begin-->  
#### Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads (RHEL)  
  
The corosync token setting determines the timeout that is used directly, or as a base, for real token timeout calculation in HA clusters. To allow memory-preserving maintenance, set the corosync token to 30000 for SAP on Azure.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: deede7ea-68c5-4fb9-8f08-5e706f88ac67  

<!--deede7ea-68c5-4fb9-8f08-5e706f88ac67_end-->
  

<!--35ef8bba-923e-44f3-8f06-691deb679468_begin-->  
#### Set the expected votes parameter to '2' in Pacemaker cofiguration in ASCS HA setup in SAP workloads (RHEL)  
  
For a two node HA cluster, set the quorum 'expected-votes' parameter to '2' as recommended for SAP on Azure to ensure a proper quorum, resilience, and data consistency.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 35ef8bba-923e-44f3-8f06-691deb679468  

<!--35ef8bba-923e-44f3-8f06-691deb679468_end-->
  

<!--0fffcdb4-87db-44f2-956f-dc9638248659_begin-->  
#### Enable the 'concurrent-fencing' parameter in Pacemaker cofiguration in ASCS HA setup in SAP workloads (ConcurrentFencingHAASCSRH)  
  
Concurrent fencing enables the fencing operations to be performed in parallel, which enhances high availability (HA), prevents split-brain scenarios, and contributes to a robust SAP deployment. Set this parameter to 'true' in the Pacemaker cluster configuration for ASCS HA setup.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 0fffcdb4-87db-44f2-956f-dc9638248659  

<!--0fffcdb4-87db-44f2-956f-dc9638248659_end-->
  

<!--6921340e-baa1-424f-80d5-c07bbac3cf7c_begin-->  
#### Ensure that stonith is enabled for the cluster configuration in ASCS HA setup in SAP workloads  
  
In a Pacemaker cluster, the implementation of node level fencing is done using a STONITH (Shoot The Other Node in the Head) resource. To help manage failed nodes, ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 6921340e-baa1-424f-80d5-c07bbac3cf7c  

<!--6921340e-baa1-424f-80d5-c07bbac3cf7c_end-->
  

<!--4eb10096-942e-402d-b4a6-e4e271c87a02_begin-->  
#### Set the stonith timeout to 144 for the cluster configuration in ASCS HA setup in SAP workloads  
  
The ‘stonith-timeout’ specifies how long the cluster waits for a STONITH action to complete. Setting it to '144' seconds allows more time for fencing actions to complete. We recommend this setting for HA clusters for SAP on Azure.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 4eb10096-942e-402d-b4a6-e4e271c87a02  

<!--4eb10096-942e-402d-b4a6-e4e271c87a02_end-->
  

<!--9f30eb2b-6a6f-4fa8-89dc-85a395c31233_begin-->  
#### Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads (SUSE)  
  
The corosync token setting determines the timeout that is used directly, or as a base, for real token timeout calculation in HA clusters. To allow memory-preserving maintenance, set the corosync token to '30000' for SAP on Azure.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 9f30eb2b-6a6f-4fa8-89dc-85a395c31233  

<!--9f30eb2b-6a6f-4fa8-89dc-85a395c31233_end-->
  

<!--f32b8f89-fb3c-4030-bd4a-0a16247db408_begin-->  
#### Set 'token_retransmits_before_loss_const' to 10 in Pacemaker cluster in ASCS HA setup in SAP workloads  
  
The corosync token_retransmits_before_loss_const determines how many token retransmits are attempted before timeout in HA clusters. For stability and reliability, set the 'totem.token_retransmits_before_loss_const' to '10' for ASCS HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: f32b8f89-fb3c-4030-bd4a-0a16247db408  

<!--f32b8f89-fb3c-4030-bd4a-0a16247db408_end-->
  

<!--fed84141-4942-49b3-8b0c-73a8b352f754_begin-->  
#### The 'corosync join' timeout specifies in milliseconds how long to wait for join messages in the membership protocol so when a new node joins the cluster, it has time to synchronize its state with existing nodes. Set to '60' in Pacemaker cluster configuration for ASCS HA setup.  
  
  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: fed84141-4942-49b3-8b0c-73a8b352f754  

<!--fed84141-4942-49b3-8b0c-73a8b352f754_end-->
  

<!--73227428-640d-4410-aec4-bac229a2b7bd_begin-->  
#### Set the 'corosync consensus' in Pacemaker cluster to '36000' for ASCS HA setup in SAP workloads  
  
The corosync 'consensus' parameter specifies in milliseconds how long to wait for consensus before starting a round of membership in the cluster configuration. Set 'consensus' in the Pacemaker cluster configuration for ASCS HA setup to 1.2 times the corosync token for reliable failover behavior.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 73227428-640d-4410-aec4-bac229a2b7bd  

<!--73227428-640d-4410-aec4-bac229a2b7bd_end-->
  

<!--14a889a6-374f-4bd4-8add-f644e3fe277d_begin-->  
#### Set the 'corosync max_messages' in Pacemaker cluster to '20' for ASCS HA setup in SAP workloads  
  
The corosync 'max_messages' constant specifies the maximum number of messages that one processor can send on receipt of the token. Set it to 20 times the corosync token parameter in the Pacemaker cluster configuration to allow efficient communication without overwhelming the network.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 14a889a6-374f-4bd4-8add-f644e3fe277d  

<!--14a889a6-374f-4bd4-8add-f644e3fe277d_end-->
  

<!--89a9ddd9-f9bf-47e4-b5f7-a0a4edfa0cdb_begin-->  
#### Set 'expected votes' to '2' in the cluster configuration in ASCS HA setup in SAP workloads (SUSE)  
  
For a two node HA cluster, set the quorum 'expected_votes' parameter to 2 as recommended for SAP on Azure to ensure a proper quorum, resilience, and data consistency.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 89a9ddd9-f9bf-47e4-b5f7-a0a4edfa0cdb  

<!--89a9ddd9-f9bf-47e4-b5f7-a0a4edfa0cdb_end-->
  

<!--2030a15b-ff0b-47c3-b934-60072ccda75e_begin-->  
#### Set the two_node parameter to 1 in the cluster cofiguration in ASCS HA setup in SAP workloads  
  
For a two node HA cluster, set the quorum parameter 'two_node' to 1 as recommended for SAP on Azure.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 2030a15b-ff0b-47c3-b934-60072ccda75e  

<!--2030a15b-ff0b-47c3-b934-60072ccda75e_end-->
  

<!--dc19b2c9-0770-4929-8f63-81c07fe7b6f3_begin-->  
#### Enable 'concurrent-fencing' in Pacemaker ASCS HA setup in SAP workloads (ConcurrentFencingHAASCSSLE)  
  
Concurrent fencing enables the fencing operations to be performed in parallel, which enhances HA, prevents split-brain scenarios, and contributes to a robust SAP deployment. Set this parameter to 'true' in the Pacemaker cluster configuration for ASCS HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: dc19b2c9-0770-4929-8f63-81c07fe7b6f3  

<!--dc19b2c9-0770-4929-8f63-81c07fe7b6f3_end-->
  

<!--cb56170a-0ecb-420a-b2c9-5c4878a0132a_begin-->  
#### Ensure the number of 'fence_azure_arm' instances is one in Pacemaker in HA enabled SAP workloads  
  
If you're using Azure fence agent for fencing with either managed identity or service principal, ensure that there's one instance of fence_azure_arm (an I/O fencing agent for Azure Resource Manager) in the Pacemaker configuration for ASCS HA setup for high availability.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: cb56170a-0ecb-420a-b2c9-5c4878a0132a  

<!--cb56170a-0ecb-420a-b2c9-5c4878a0132a_end-->
  

<!--05747c68-715f-4c8f-b027-f57a931cc07a_begin-->  
#### Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for ASCS HA setup  
  
For reliable function of the Pacemaker for ASCS HA set the 'stonith-timeout' to 900. This setting is applicable if you're using the Azure fence agent for fencing with either managed identity or service principal.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 05747c68-715f-4c8f-b027-f57a931cc07a  

<!--05747c68-715f-4c8f-b027-f57a931cc07a_end-->
  

<!--88261a1a-6a32-4fb6-8bbd-fcd60fdfcab6_begin-->  
#### Create the softdog config file in Pacemaker configuration for ASCS HA setup in SAP workloads  
  
The softdog timer is loaded as a kernel module in linux OS. This timer  triggers a system reset if it detects that the system has hung. Ensure that the softdog configuation file is created in the Pacemaker cluster forASCS HA set up  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 88261a1a-6a32-4fb6-8bbd-fcd60fdfcab6  

<!--88261a1a-6a32-4fb6-8bbd-fcd60fdfcab6_end-->
  

<!--3730bc11-c81c-43eb-896a-8fce0bac139d_begin-->  
#### Ensure the softdog module is loaded in for Pacemaler in ASCS HA setup in SAP workloads  
  
The softdog timer is loaded as a kernel module in linux OS. This timer  triggers a system reset if it detects that the system has hung. First ensure that you created the softdog configuration file, then load the softdog module in the Pacemaker configuration for ASCS HA setup  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 3730bc11-c81c-43eb-896a-8fce0bac139d  

<!--3730bc11-c81c-43eb-896a-8fce0bac139d_end-->
  

<!--255e9f7b-db3a-4a67-b87e-6fdc36ea070d_begin-->  
#### Set PREFER_SITE_TAKEOVER parameter to 'true' in the Pacemaker configuration for HANA DB HA setup  
  
The PREFER_SITE_TAKEOVER parameter in SAP HANA defines if the HANA system replication (SR) resource agent prefers to takeover the secondary instance instead of restarting the failed primary locally. For reliable function of HANA DB high availability (HA) setup, set PREFER_SITE_TAKEOVER to 'true'.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 255e9f7b-db3a-4a67-b87e-6fdc36ea070d  

<!--255e9f7b-db3a-4a67-b87e-6fdc36ea070d_end-->
  

<!--4594198b-b114-4865-8ed8-be06db945408_begin-->  
#### Enable stonith in the cluster cofiguration in HA enabled SAP workloads for VMs with Redhat OS  
  
In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. To help manage failed nodes, ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration of your SAP workload.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 4594198b-b114-4865-8ed8-be06db945408  

<!--4594198b-b114-4865-8ed8-be06db945408_end-->
  

<!--604f3822-6a28-47db-b31c-4b0dbe317625_begin-->  
#### Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with RHEL OS  
  
The corosync token setting determines the timeout that is used directly, or as a base, for real token timeout calculation in HA clusters. To allow memory-preserving maintenance, set the corosync token to 30000 for SAP on Azure with Redhat OS.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 604f3822-6a28-47db-b31c-4b0dbe317625  

<!--604f3822-6a28-47db-b31c-4b0dbe317625_end-->
  

<!--937a1997-fc2d-4a3a-a9f6-e858a80921fd_begin-->  
#### Set the  expected votes parameter to '2' in HA enabled SAP workloads (RHEL)  
  
For a two node HA cluster, set the quorum votes to '2' as recommended for SAP on Azure to ensure a proper quorum, resilience, and data consistency.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 937a1997-fc2d-4a3a-a9f6-e858a80921fd  

<!--937a1997-fc2d-4a3a-a9f6-e858a80921fd_end-->
  

<!--6cc63594-c89f-4535-b878-cdd13659cfc5_begin-->  
#### Enable the 'concurrent-fencing' parameter in the Pacemaker cofiguration for HANA DB HA setup  
  
Concurrent fencing enables the fencing operations to be performed in parallel, which enhances high availability (HA), prevents split-brain scenarios, and contributes to a robust SAP deployment. Set this parameter to 'true' in the Pacemaker cluster configuration for HANA DB HA setup.  

For More information, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel)  
ID: 6cc63594-c89f-4535-b878-cdd13659cfc5  

<!--6cc63594-c89f-4535-b878-cdd13659cfc5_end-->
  

<!--230fddab-0864-4c5e-bb27-037bec7c46c6_begin-->  
#### Set parameter PREFER_SITE_TAKEOVER to 'true' in the cluster cofiguration in HA enabled SAP workloads  
  
The PREFER_SITE_TAKEOVER parameter in SAP HANA topology defines if the HANA SR resource agent prefers to takeover the secondary instance instead of restarting the failed primary locally. For reliable function of HANA DB HA setup, set it to 'true'.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 230fddab-0864-4c5e-bb27-037bec7c46c6  

<!--230fddab-0864-4c5e-bb27-037bec7c46c6_end-->
  

<!--210d0895-074c-4cc7-88de-b0a9e00820c6_begin-->  
#### Enable stonith in the cluster configuration in HA enabled SAP workloads for VMs with SUSE OS  
  
In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. To help manage failed nodes, ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 210d0895-074c-4cc7-88de-b0a9e00820c6  

<!--210d0895-074c-4cc7-88de-b0a9e00820c6_end-->
  

<!--64e5e17e-640e-430f-987a-721f133dbd5c_begin-->  
#### Set the stonith timeout to 144 for the cluster configuration in HA enabled SAP workloads  
  
The ‘stonith-timeout’ specifies how long the cluster waits for a STONITH action to complete. Setting it to '144' seconds allows more time for fencing actions to complete. We recommend this setting for HA clusters for SAP on Azure.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 64e5e17e-640e-430f-987a-721f133dbd5c  

<!--64e5e17e-640e-430f-987a-721f133dbd5c_end-->
  

<!--a563e3ad-b6b5-4ec2-a444-c4e30800b8cf_begin-->  
#### Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with SUSE OS  
  
The corosync token setting determines the timeout that is used directly, or as a base, for real token timeout calculation in HA clusters. To allow memory-preserving maintenance, set the corosync token to 30000 for HA enabled HANA DB for VM with SUSE OS.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: a563e3ad-b6b5-4ec2-a444-c4e30800b8cf  

<!--a563e3ad-b6b5-4ec2-a444-c4e30800b8cf_end-->
  

<!--99681175-0124-44de-93ae-edc08f9dc0a8_begin-->  
#### Set 'token_retransmits_before_loss_const' to 10 in Pacemaker cluster in HA enabled SAP workloads  
  
The corosync token_retransmits_before_loss_const determines how many token retransmits are attempted before timeout in HA clusters.  Set the totem.token_retransmits_before_loss_const to 10 as recommended for HANA DB HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 99681175-0124-44de-93ae-edc08f9dc0a8  

<!--99681175-0124-44de-93ae-edc08f9dc0a8_end-->
  

<!--b8ac170f-433e-4d9c-8b75-f7070a2a5c92_begin-->  
#### Set the 'corosync join' in Pacemaker cluster to 60 for HA enabled HANA DB in SAP workloads  
  
The 'corosync join' timeout specifies in milliseconds how long to wait for join messages in the membership protocol so when a new node joins the cluster, it has time to synchronize its state with existing nodes. Set to '60' in Pacemaker cluster configuration for HANA DB HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: b8ac170f-433e-4d9c-8b75-f7070a2a5c92  

<!--b8ac170f-433e-4d9c-8b75-f7070a2a5c92_end-->
  

<!--63e27ad9-1804-405a-97eb-d784686ffbe3_begin-->  
#### Set the 'corosync consensus' in Pacemaker cluster to 36000 for HA enabled HANA DB in SAP workloads  
  
The corosync 'consensus' parameter specifies in milliseconds how long to wait for consensus before starting a new round of membership in the cluster. For reliable failover behavior, set 'consensus' in the Pacemaker cluster configuration for HANA DB HA setup to 1.2 times the corosync token.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 63e27ad9-1804-405a-97eb-d784686ffbe3  

<!--63e27ad9-1804-405a-97eb-d784686ffbe3_end-->
  

<!--7ce9ff70-f684-47a2-b26f-781f80b1bccc_begin-->  
#### Set the 'corosync max_messages' in Pacemaker cluster to 20 for HA enabled HANA DB in SAP workloads  
  
The corosync 'max_messages' constant specifies the maximum number of messages that one processor can send on receipt of the token. To allow efficient communication without overwhelming the network, set it to 20 times the corosync token parameter in the Pacemaker cluster configuration.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 7ce9ff70-f684-47a2-b26f-781f80b1bccc  

<!--7ce9ff70-f684-47a2-b26f-781f80b1bccc_end-->
  

<!--37240e75-9493-433a-8671-2e2582584875_begin-->  
#### Set the  expected votes parameter to 2 in HA enabled SAP workloads (SUSE)  
  
Set the expected votes parameter to '2' in the cluster configuration in HA enabled SAP workloads to ensure a proper quorum, resilience, and data consistency.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 37240e75-9493-433a-8671-2e2582584875  

<!--37240e75-9493-433a-8671-2e2582584875_end-->
  

<!--41cd63e2-69a4-4a4f-bb69-1d3f832001f9_begin-->  
#### Set the two_node parameter to 1 in the cluster configuration in HA enabled SAP workloads  
  
For a two node HA cluster, set the quorum parameter 'two_node' to 1 as recommended for SAP on Azure.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 41cd63e2-69a4-4a4f-bb69-1d3f832001f9  

<!--41cd63e2-69a4-4a4f-bb69-1d3f832001f9_end-->
  

<!--d763b894-7641-4c5d-9bc3-6f2515a6eb67_begin-->  
#### Enable the 'concurrent-fencing' parameter in the cluster configuration in HA enabled SAP workloads  
  
Concurrent fencing enables the fencing operations to be performed in parallel, which enhances HA, prevents split-brain scenarios, and contributes to a robust SAP deployment. Set this parameter to 'true' in HA enabled SAP workloads.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: d763b894-7641-4c5d-9bc3-6f2515a6eb67  

<!--d763b894-7641-4c5d-9bc3-6f2515a6eb67_end-->
  

<!--1f4b5e87-69e9-470a-8245-f337fd0d5528_begin-->  
#### Ensure there is one instance of fence_azure_arm in the Pacemaker configuration for HANA DB HA setup  
  
If you're using Azure fence agent for fencing with either managed identity or service principal, ensure that  one instance of fence_azure_arm (an I/O fencing agent for Azure Resource Manager) is in the Pacemaker configuration for HANA DB HA setup for high availability.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 1f4b5e87-69e9-470a-8245-f337fd0d5528  

<!--1f4b5e87-69e9-470a-8245-f337fd0d5528_end-->
  

<!--943f7572-1884-4120-808d-ac2a3e70e33a_begin-->  
#### Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for HANA DB HA setup  
  
If you're using the Azure fence agent for fencing with either managed identity or service principal, ensure reliable function of the Pacemaker for HANA DB HA setup, by setting the 'stonith-timeout' to 900.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 943f7572-1884-4120-808d-ac2a3e70e33a  

<!--943f7572-1884-4120-808d-ac2a3e70e33a_end-->
  

<!--63233341-73a2-4180-b57f-6f83395161b9_begin-->  
#### Ensure that the softdog config file is in the Pacemaker configuration for  HANA DB in SAP workloads  
  
The softdog timer is loaded as a kernel module in Linux OS. This timer  triggers a system reset if it detects that the system is hung. Ensure that the softdog configuration file is created in the Pacemaker cluster for HANA DB HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: 63233341-73a2-4180-b57f-6f83395161b9  

<!--63233341-73a2-4180-b57f-6f83395161b9_end-->
  

<!--b27248cd-67dc-4824-b162-4563adaa6d70_begin-->  
#### Ensure the softdog module is loaded in Pacemaker in ASCS HA setup in SAP workloads  
  
The softdog timer is loaded as a kernel module in Linux OS. This timer  triggers a system reset if it detects that the system is hung. First ensure that you created the softdog configuration file, then load the softdog module in the Pacemaker configuration for HANA DB HA setup.  

For More information, see [High availability for SAP HANA on Azure VMs on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-high-availability)  
ID: b27248cd-67dc-4824-b162-4563adaa6d70  

<!--b27248cd-67dc-4824-b162-4563adaa6d70_end-->
  
<!--microsoft_workloads_end--->
<!--articleBody-->
  
  
  
## Next steps

Learn more about [Reliability - Microsoft Azure Well Architected Framework](/azure/architecture/framework/resiliency/overview)
