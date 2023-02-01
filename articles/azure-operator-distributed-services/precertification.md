--- 
Title: Precertification process for network function workloads on Azure Operator Distributed Services (AODS)
Description: Overview of the precertification process for network function workloads on Azure Operator Distributed Services (AODS)
Author: #TBD
ms.author: kaanan
ms.date: 01/30/2023
ms.topic: overview
ms.service: Azure Operator Distributed Services
---
### Network Function Manager

The Azure [Network Function Manager
(NFM)](https://docs.microsoft.com/en-us/azure/network-function-manager/overview)
provides a cloud native orchestration and managed experience for
pre-certified network functions (from the Azure Marketplace). The NFM
provides consistent Azure managed applications experience for Network Functions.

### Pre-Certification Process
<<<<<<< HEAD

This section outlines the Network Function Deployment Precertification process. Microsoft uses this process with Network Equipment Providers (NEP) that
provide network function(s).  This process guides the partner through
onboarding the network function onto AODS and
certifies the network function deployment methods using Azure deployment
services. The goal of this program is to ensure that the partner's network function
deployment process is predictable and repeatable on the AODS platform.
Microsoft provides a precertification environment for the partners to validate
the deployment of their network function. As a result, the partners' network functions will be published in the Microsoft catalog of
network functions. This catalog will be available to operators using the AODS platform.


Here are the steps of the NF Deployment Precertification:
=======
>>>>>>> 8ccc9daca70687ddc46ae49b75357fb440411d08

This section outlines the Network Function Deployment Precertification process. Microsoft uses this process with Network Equipment Providers (NEP) that
provide network function(s).  This process guides the partner through
onboarding the network function onto AODS and
certifies the network function deployment methods using Azure deployment
services. The goal of this program is to ensure that the partner's network function
deployment process is predictable and repeatable on the AODS platform.
Microsoft provides a precertification environment for the partners to validate
the deployment of their network function. As a result, the partners' network functions will be published in the Microsoft catalog of
network functions. This catalog will be available to operators using the AODS platform.


Here are the steps of the NF Deployment Precertification:

:::image type="content" source="media/nfm-precert-process.png" alt-text="Pre-Certification Process.":::
Figure: Pre-Certification (precert) Process

## Prerequisites and process for partner On-boarding to the Pre-Cert Lab

To ensure an efficient and effective onboarding process for the partner there are perquisites to pre-certification lab entry.

1. The partners start the Azure Marketplace agreement and [create a partner
center account](<https://docs.microsoft.com/en-us/azure/marketplace/create-account>).
The partner can then publish the network function
offers in the marketplace. The marketplace agreement doesn't have to be
completed prior to precert lab entry. However, it is an important step before the
helm charts and images onboarded to Azure Network Function Manager (ANFM)
service are added to the precertified catalog.

2. Microsoft will conduct several sessions on key topics with the partner:

    a. Technical discussions describing the AODS architecture with focus on run time specification:
    * Compute dimensions for master and worker nodes, memory, storage requirements, and compute capabilities
      * NUMA alignment
      * huge page support
      * hyperthreading
    * VM Networking/K8s networking requirements:
      * SR-IOV
      * DPDK
    * Review cloudinit support for VM based network functions
    * Microsoft AKS-Hybrid support for tenant workloads, CNI versions for Calico and Cultus

    b. The AODS platform includes a managed fabric automation service. With an agreement from the partner regarding the network function requirements, Microsoft will engage with the partner and review:
    * the network fabric architecture 
    * and fabric automation APIs for the creation of L2/L3 isolation domains 
    * L3 route policies that will extend the network connectivity from the node to the TOR/CE router. 

    The fabric deep dive sessions will identify the peering requirements, route policies, and filters that need to be configured in the fabric for testing the network function.

    c. Microsoft will work with the NEPs to onboard the helm charts and container images (CNFs) or VM images (VNFs) to the Azure Network Function Manager service (ANFM). Microsoft will consult with the partner to validate the supported versions of the helm charts for deployment using the ANFM service.

    d. Microsoft will provide basic traffic simulation tools such as Developing Solutions' dsTest or Spirent Landslide in the precert lab environment. The partners can also deploy other test tools of their choice during the precert testing. Microsoft will work with the partner to identify the additional test tool requirements for the specific network function and prepare the environment before lab entry.

3. On reviewing the requirements that are described from 2a – 2d, Microsoft will work with the partners to define Azure Resource Manager (ARM) templates for the following components that are required for the deployment of resources in the precert lab before starting the smoke testing.

    * ARM Templates for network fabric automation components – L2/L3 isolation domains, L3 route policies if any for the end-to-end test set-up
    * ARM templates for AKS-Hybrid (CNF), VM instance (VNF), workload networks and management networks that describe subcluster networking.
    * Onboard the helm charts and images to ANFM service and create a vendor image version for deployment into precert lab
    * ARM templates for deployment of NF using ANFM with the user data properties required to bring up the container pods/ VMs with the right initial configuration
    * ARM templates for deployment of any config management application that NEPs will bring in to configure settings before smoke testing
    * ARM templates for deployment of additional test tools (CNFs/VNFs) that are required for smoke testing of the NF application in the precert lab

## AODS technical specification documents provided to NF partners

As a part of technical engagement, the documents that Microsoft will provide to the partner are:

   * AODS runtime specification document and the Azure Resource Manager (ARM) API specification document for creating AKS-Hybrid clusters (CNFs) and VM instances (VNFs) on an AODS cluster
   * Azure Resource Manager API specification document for creating fabric automation components that are required for tenant networking.
   * ARM API specification document for onboarding to ANFM service. The specification will also define the customer facing APIs for deployment of network functions using the ANFM service.

#### Scheduling/Partner Engagement

The Network Function Deployment Precertification lab will be a shared
infrastructure where multiple partners will be testing simultaneously. Based
on the available capacity in the lab Microsoft will allocate resources for
various partners to complete the Network Function Deployment Precertification activities in a timely and limited window.

If the partner has a dedicated AODS environment in their facility, Microsoft will work with them
 to enable updated version of AODS software to complete Network Function Deployment Precertification.

#### Deployment Testing

##### Scope of testing in the precertification lab

With the ARM templates defined in the previous section, Microsoft will work
with the partners to identify the appropriate lab environment to perform the
testing. Microsoft will enable the appropriate Subscription Id and Resource
Groups so that the partners can deploy all the resources from the Azure
Portal/CLI into the target lab environment. Microsoft will also enable jump box
access for the partners to perform troubleshooting or remote connectivity to
the test tools/config management tools. The following verification will be
performed by the partners and results reviewed by Microsoft:

1. Verify all the resources in the ARM template that correspond to tenant
cluster definition – AKS-Hybrid cluster/ VM instance, managed fabric resources
for isolation domain and L3 route policies, workload networks and management
network resources for K8s networks/ VM networks are deployed correctly
(resources will be in a provisioned state in the Azure Portal).
2. Verify the basic network connectivity between all the end points of test
set-up is working.
3. After the set-up of the tenant cluster is validated, verify that the
deployment of the network function using ANFM is working as designed and the
container pods that are instantiated are in a running state.
4. Verify that NF works with supported versions of K8s, CNI versions.
5. Verify that the helm-based upgrade operations on the NF application using
ANFM service is working as designed.
6. When the NF is deployed successfully, and the correct configurations are
applied to the network function, perform interface testing to validate the
networking internal to the K8s cluster and across the cluster to a source/sink
(simulator) is working as designed.
7. Perform a low-volume traffic simulation (smoke test) on the application by
deploying the test tool application either inside the AODS cluster to validate
the internal routing and/or deploying the test tool application outside the
AODS cluster to test the routing across the CE based on the characteristics
of the application.
8. Azure PaaS integration (optional): Microsoft precert environment will be
connected to the Azure region using hybrid connectivity technologies such a
ExpressRoute. The NEP partner can use this environment to further integrate
with Azure PaaS services for the application deployed in the AODS cluster and
verify that the PaaS functionality is working as designed.
9. After the testing is complete, perform delete operation on the NF resource
in the ANFM service and verify that the container pods are removed from the
subcluster.
10. Verify all the resources specified in the ARM template for tenant sub
cluster and fabric components are deleted correctly with the delete operation
including cleanup of dependent resources. Validate that deleting the network fabric
resources removes the corresponding configuration on the Network
devices.

##### Testing tools in Pre-Certification lab

Microsoft will provide basic traffic simulation tools such as Developing
Solutions dsTest, or Spirent Landslide, to enable the partners to perform low
volume interface testing (smoke test) on the applications. This testing is
intended to validate packet flow patterns for the network function as deployed
and integrated on the AODS instance.  Microsoft will accommodate vendor
provided traffic simulation tools and Microsoft will work with the vendor to
onboard it to the lab based on the requirements and available
capacity/resources.

##### Application removal

Placeholder for upcoming text

#### Test results from deployment precertification testing

Microsoft will review the test results, provided by the partner, for the
application being precertified. The
objective of the Network Function Deployment Precertification process is to
ensure that the test cases defined, and test results produced comprehensively
validate the deployment of the application on the AODS platform. For interface
testing using a test tool such as Spirent, Microsoft will work with the
partners to identify the test scenarios.  After the deployment validation and smoke testing are completed in the precertification lab, Microsoft will review
the test results with the NEPS to confirm that the test results meet the scope
of deployment precertification.

Microsoft will then work with the partner to graduate the NF application to the
ANFM service catalog. The partners are free to share the results of the
precertification/recertification testing.

#### Recertification

Microsoft will enable the preview version of updates to AODS platform and ANFM
service in the lab and provide the partners with release notes of updates to
the platform. Microsoft will then coordinate with partners to schedule
precertification testing with any updates to the deployment templates, helm
charts and images. Microsoft will also enable the partners to test the
application when the AODS platform upgrade is in progress by making the current
production version and the new preview version available in the lab environment.  

Microsoft will support the partners demonstration of network function
resiliency capabilities when an AODS disruptive or non-disruptive upgrade is
in progress.

#### Network Function Deployment Precertification and NF offerings to operators

The goal of the Microsoft network function deployment precertification program
is to enable a catalog of network functions from ecosystem partners that
conform to the AODS specifications for compute, storage, and networking. NF
partners onboarding to precertification program and ANFM service will not be
required to change the commercial licensing arrangement with the operators. If
the NF partner is interested in listing their offer in the Azure Marketplace,
Microsoft will work with the partner to enable this offering in the marketplace.
