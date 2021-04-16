---
title: Azure Red Hat OpenShift Responsibility Assignment Matrix
description: Learn about the ownership of responsibilities for the operation of an Azure Red Hat OpenShift cluster
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 4/12/2021
author: sakthi-vetrivel
ms.author: suvetriv
keywords: aro, openshift, az aro, red hat, cli, RACI, support
---

# Overview of responsibilities for Azure Red Hat OpenShift

This document outlines the responsibilities of Microsoft, Red Hat, and customers for Azure Red Hat OpenShift clusters. For more information about Azure Red Hat OpenShift and its components, see the Azure Red Hat OpenShift Service Definition.

While Microsoft and Red Hat manage the Azure Red Hat OpenShift service, the customer shares responsibility for the functionality of their cluster. While Azure Red Hat OpenShift clusters are hosted on Azure resources in customer Azure subscriptions, they are accessed remotely. Underlying platform and data security is owned by Microsoft and Red Hat.

## Overview
<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong><a href="#incident-and-operations-management">Incident and Operations Management</a></strong>
   </td>
   <td><strong><a href="#change-management">Change Management</a></strong>
   </td>
   <td><strong><a href="#identity-and-access-management">Identity and Access Management</a></strong>
   </td>
   <td><strong><a href="#security-and-regulation-compliance">Security and Regulation Compliance</a></strong>
   </td>
  </tr>
  <tr>
   <td><a href="#customer-data-and-applications">Customer data</a>
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
  </tr>
  <tr>
   <td><a href="#customer-data-and-applications">Customer applications</a>
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
  </tr>
  <tr>
   <td><a href="#customer-data-and-applications">Developer services </a>
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
   <td>Customer
   </td>
  </tr>
  <tr>
   <td>Platform monitoring
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Logging
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
  </tr>
  <tr>
   <td>Application networking
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Cluster networking
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Virtual networking
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
   <td>Shared
   </td>
  </tr>
  <tr>
   <td>Control plane nodes
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Worker nodes
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Cluster Version
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Shared
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Capacity Management
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Shared
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Virtual Storage
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
  <tr>
   <td>Physical Infrastructure and Security
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
   <td>Microsoft and Red Hat
   </td>
  </tr>
</table>


Table 1. Responsibilities by resource


## Tasks for shared responsibilities by area 

### Incident and operations management 

The customer and Microsoft and Red Hat share responsibility for the monitoring and maintenance of an Azure Red Hat OpenShift cluster. The customer is responsible for incident and operations management of [customer application data](#customer-data-and-applications) and any custom networking the customer may have configured.

<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong>Microsoft and Red Hat responsibilities</strong>
   </td>
   <td><strong>Customer responsibilities</strong>
   </td>
  </tr>
  <tr>
   <td>Application networking
   </td>
   <td>
<ul>

<li>Monitor cloud load balancer(s) and native OpenShift router service, and respond to alerts.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Monitor health of service load balancer endpoints.

<li>Monitor health of application routes, and the endpoints behind them.

<li>Report outages to Microsoft and Red Hat.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Virtual networking
   </td>
   <td>
<ul>

<li>Monitor cloud load balancers, subnets, and Azure cloud components necessary for default platform networking, and respond to alerts.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Monitor network traffic that is optionally configured via VNet to VNet connection, VPN connection, or Private Link connection for potential issues or security threats.
</li>
</ul>
   </td>
  </tr>
</table>


Table 2. Shared responsibilities for incident and operations management


### Change management

Microsoft and Red Hat are responsible for enabling changes to the cluster infrastructure and services that the customer will control, as well as maintaining versions available for the master nodes, infrastructure services, and worker nodes. The customer is responsible for initiating infrastructure changes and installing and maintaining optional services and networking configurations on the cluster, as well as all changes to customer data and customer applications.


<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong>Microsoft and Red Hat responsibilities</strong>
   </td>
   <td><strong>Customer responsibilities</strong>
   </td>
  </tr>
  <tr>
   <td>Logging
   </td>
   <td>
<ul>

<li>Centrally aggregate and monitor platform audit logs.

<li>Provide documentation for the customer to enable application logging using Log Analytics through Azure Monitor for containers.

<li>Provide audit logs upon customer request.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Install the optional default application logging operator on the cluster.

<li>Install, configure, and maintain any optional app logging solutions, such as logging sidecar containers or third-party logging applications.

<li>Tune size and frequency of application logs being produced by customer applications if they are affecting the stability of the cluster.

<li>Request platform audit logs through a support case for researching specific incidents.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Application networking
   </td>
   <td>
<ul>

<li>Set up public cloud load balancers

<li>Set up native OpenShift router service. Provide the ability to set the router as private and add up to one additional router shard.

<li>Install, configure, and maintain OpenShift SDN components for default internal pod traffic.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Configure non-default pod network permissions for project and pod networks, pod ingress, and pod egress using NetworkPolicy objects.

<li>Request and configure any additional service load balancers for specific services.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Cluster networking
   </td>
   <td>
<ul>

<li>Set up cluster management components, such as public or private service endpoints and necessary integration with virtual networking components.

<li>Set up internal networking components required for internal cluster communication between worker and master nodes.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Provide optional non-default IP address ranges for machine CIDR, service CIDR, and pod CIDR if needed through OpenShift Cluster Manager when the cluster is provisioned.

<li>Request that the API service endpoint be made public or private on cluster creation or after cluster creation through Azure CLI.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Virtual networking
   </td>
   <td>
<ul>

<li>Set up and configure virtual networking components required to provision the cluster, including virtual private cloud, subnets, load balancers, internet gateways, NAT gateways, etc.

<li>Provide the ability for the customer to manage VPN connectivity with on-premises resources, VNet to VNet connectivity, and Private Link connectivity as required through OpenShift Cluster Manager.

<li>Enable customers to create and deploy public cloud load balancers for use with service load balancers.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Set up and maintain optional public cloud networking components, such as VNet to VNet connection, VPN connection, or Private Link connection.

<li>Request and configure any additional service load balancers for specific services.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Cluster Version
   </td>
   <td>
<ul>

<li>Communicate schedule and status of upgrades for minor and maintenance versions

<li>Publish changelogs and release notes for minor and maintenance upgrades
</li>
</ul>
   </td>
   <td>
<ul>

<li>Initiate Upgrade of cluster

<li>Test customer applications on minor and maintenance versions to ensure compatibility
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Capacity Management
   </td>
   <td>
<ul>

<li>Monitor utilization of control plane (master nodes)

<li>Scale and/or resize control plane nodes to maintain quality of service

<li>Monitor utilization of customer resources including Network, Storage and Compute capacity. Where autoscaling features are not enabled alert customer for any changes required to cluster resources (eg. new compute nodes to scale, additional storage, etc.)
</li>
</ul>
   </td>
   <td>
<ul>

<li>Use the provided OpenShift Cluster Manager controls to add or remove additional worker nodes as required.

<li>Respond to Microsoft and Red Hat notifications regarding cluster resource requirements.
</li>
</ul>
   </td>
  </tr>
</table>


Table 3. Shared responsibilities for change management


### Identity and Access Management 

Identity and Access management includes all responsibilities for ensuring that only proper individuals have access to cluster, application, and infrastructure resources. This includes tasks such as providing access control mechanisms, authentication, authorization, and managing access to resources.


<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong>Microsoft and Red Hat responsibilities</strong>
   </td>
   <td><strong>Customer responsibilities</strong>
   </td>
  </tr>
  <tr>
   <td>Logging
   </td>
   <td>
<ul>

<li>Adhere to an industry standards-based tiered internal access process for platform audit logs.

<li>Provide native OpenShift RBAC capabilities.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Configure OpenShift RBAC to control access to projects and by extension a project's application logs.

<li>For third-party or custom application logging solutions, the customer is responsible for access management.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Application networking
   </td>
   <td>
<ul>

<li>Provide native OpenShift RBAC capabilities.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Configure OpenShift RBAC to control access to route configuration as required.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Cluster networking
   </td>
   <td>
<ul>

<li>Provide native OpenShift RBAC capabilities.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Manage Red Hat organization membership of Red Hat accounts.

<li>Manage Org Admins for Red Hat organization to grant access to OpenShift Cluster Manager.

<li>Configure OpenShift RBAC to control access to route configuration as required.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Virtual networking
   </td>
   <td>
<ul>

<li>Provide customer access controls through OpenShift Cluster Manager.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Manage optional user access to public cloud components through OpenShift Cluster Manager.
</li>
</ul>
   </td>
  </tr>
</table>


Table 4. Shared responsibilities for identity and access management


### Security and regulation compliance 

Security and compliance includes any responsibilities and controls that ensure compliance with relevant laws, policies, and regulations.


<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong>Microsoft and Red Hat responsibilities</strong>
   </td>
   <td><strong>Customer responsibilities</strong>
   </td>
  </tr>
  <tr>
   <td>Logging
   </td>
   <td>
<ul>

<li>Send cluster audit logs to a Microsoft and Red Hat SIEM to analyze for security events. Retain audit logs for a defined period of time to support forensic analysis.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Analyze application logs for security events. Send application logs to an external endpoint through logging sidecar containers or third-party logging applications  if longer retention is required than is offered by the default logging stack.
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Virtual networking
   </td>
   <td>
<ul>

<li>Monitor virtual networking components for potential issues and security threats.

<li>Use additional public Microsoft and Red Hat Azure tools for additional monitoring and protection.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Monitor optionally configured virtual networking components for potential issues and security threats.

<li>Configure any necessary firewall rules or data center protections as required.
</li>
</ul>
   </td>
  </tr>
</table>


Table 5. Shared responsibilities for security and regulation compliance


## Customer responsibilities when using Azure Red Hat OpenShift 


### Customer data and applications

The customer is responsible for the applications, workloads, and data that they deploy to Azure Red Hat OpenShift. However, Microsoft and Red Hat provide various tools to help the customer manage data and applications on the platform.


<table>
  <tr>
   <td><strong>Resource</strong>
   </td>
   <td><strong>How Microsoft and Red Hat helps</strong>
   </td>
   <td><strong>Customer responsibilities</strong>
   </td>
  </tr>
  <tr>
   <td>Customer Data
   </td>
   <td>
<ul>

<li>Maintain platform-level standards for data encryption as defined by industry security and compliance standards. 

<li>Provide OpenShift components to help manage application data, such as secrets.

<li>Enable integration with third-party data services (such as Azure SQL) to store and manage data outside of the cluster and/or Microsoft and Red Hat Azure.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Maintain responsibility for all customer data stored on the platform and how customer applications consume and expose this data.

<li>Etcd encryption
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Customer Applications
   </td>
   <td>
<ul>

<li>Provision clusters with OpenShift components installed so that customers can access the OpenShift and Kubernetes APIs to deploy and manage containerized applications.

<li>Provide access to OpenShift APIs that a customer can use to set up Operators to add community, third-party, Microsoft and Red Hat, and Red Hat services to the cluster. 

<li>Provide storage classes and plug-ins to support persistent volumes for use with customer applications.
</li>
</ul>
   </td>
   <td>
<ul>

<li>Maintain responsibility for customer and third-party applications, data, and their complete lifecycle.

<li>If a customer adds Red Hat, community, third party, their own, or other services to the cluster by using Operators or external images, the customer is responsible for these services and for working with the appropriate provider (including Red Hat) to troubleshoot any issues.

<li>Use the provided tools and features to <a href="https://docs.openshift.com/aro/4/architecture/understanding-development.html#application-types">configure and deploy</a>; <a href="https://docs.openshift.com/aro/4/applications/deployments/deployment-strategies.html">keep up-to-date</a>; <a href="https://docs.openshift.com/aro/4/applications/working-with-quotas.html">set up resource requests and limits</a>; <a href="https://docs.openshift.com/aro/4/getting_started/scaling-your-cluster.html">size the cluster to have enough resources to run  apps</a>; <a href="https://docs.openshift.com/aro/4/administering_a_cluster/">set up permissions</a>; integrate with other services; <a href="https://docs.openshift.com/aro/4/openshift_images/images-understand.html">manage any image streams or templates that the customer deploys</a>; <a href="https://docs.openshift.com/aro/4/cloud_infrastructure_access">externally serve</a>; save, back up, and restore data; and otherwise manage their highly available and resilient workloads.

<li>Maintain responsibility for monitoring the applications run on Azure Red Hat OpenShift; including installing and operating software to gather metrics and create alerts.
</li>
</ul>
   </td>
  </tr>
</table>


Table 7. Customer responsibilities for customer data, customer applications, and services
