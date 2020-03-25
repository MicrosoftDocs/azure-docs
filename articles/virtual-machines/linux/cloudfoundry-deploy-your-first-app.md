---
title: Deploy your first app to Cloud Foundry on Microsoft Azure 
description: Deploy an application to Cloud Foundry on Azure
author: seanmck
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.date: 06/14/2017
ms.author: seanmck
---

# Deploy your first app to Cloud Foundry on Microsoft Azure

[Cloud Foundry](https://cloudfoundry.org) is a popular open-source application platform available on Microsoft Azure. In this article, we show how to deploy and manage an application on Cloud Foundry in an Azure environment.

## Create a Cloud Foundry environment

There are several options for creating a Cloud Foundry environment on Azure:

- Use the [Pivotal Cloud Foundry offer][pcf-azuremarketplace] in the Azure Marketplace to create a standard environment that includes PCF Ops Manager and the Azure Service Broker. You can find [complete instructions][pcf-azuremarketplace-pivotaldocs] for deploying the marketplace offer in the Pivotal documentation.
- Create a customized environment by [deploying Pivotal Cloud Foundry manually][pcf-custom].
- [Deploy the open-source Cloud Foundry packages directly][oss-cf-bosh] by setting up a [BOSH](https://bosh.io) director, a VM that coordinates the deployment of the Cloud Foundry environment.

> [!IMPORTANT] 
> If you are deploying PCF from the Azure Marketplace, make a note of the SYSTEMDOMAINURL and the admin credentials required to access the Pivotal Apps Manager, both of which are described in the marketplace deployment guide. They are needed to complete this tutorial. For marketplace deployments, the SYSTEMDOMAINURL is in the form `https://system.*ip-address*.cf.pcfazure.com`.

## Connect to the Cloud Controller

The Cloud Controller is the primary entry point to a Cloud Foundry environment for deploying and managing applications. The core Cloud Controller API (CCAPI) is a REST API, but it is accessible through various tools. In this case, we interact with it through the [Cloud Foundry CLI][cf-cli]. You can install the CLI on Linux, macOS, or Windows, but if you'd prefer not to install it at all, it is available pre-installed in the [Azure Cloud Shell][cloudshell-docs].

To log in, prepend `api` to the SYSTEMDOMAINURL that you obtained from the marketplace deployment. Since the default deployment uses a self-signed certificate, you should also include the `skip-ssl-validation` switch.

```bash
cf login -a https://api.SYSTEMDOMAINURL --skip-ssl-validation
```

You are prompted to log in to the Cloud Controller. Use the admin account credentials that you acquired from the marketplace deployment steps.

Cloud Foundry provides *orgs* and *spaces* as namespaces to isolate the teams and environments within a shared deployment. The PCF marketplace deployment includes the default *system* org and a set of spaces created to contain the base components, like the autoscaling service and the Azure service broker. For now, choose the *system* space.


## Create an org and space

If you type `cf apps`, you see a set of system applications that have been deployed in the system space within the system org. 

You should keep the *system* org reserved for system applications, so create an org and space to house our sample application.

```bash
cf create-org myorg
cf create-space dev -o myorg
```

Use the target command to switch to the new org and space:

```bash
cf target -o testorg -s dev
```

Now, when you deploy an application, it is automatically created in the new org and space. To confirm that there are currently no apps in the new org/space, type `cf apps` again.

> [!NOTE] 
> For more information about orgs and spaces and how they can be used for role-based access control (RBAC), see the [Cloud Foundry documentation][cf-orgs-spaces-docs].

## Deploy an application

Let's use a sample Cloud Foundry application called Hello Spring Cloud, which is written in Java and based on the [Spring Framework](https://spring.io) and [Spring Boot](https://projects.spring.io/spring-boot/).

### Clone the Hello Spring Cloud repository

The Hello Spring Cloud sample application is available on GitHub. Clone it to your environment and change into the new directory:

```bash
git clone https://github.com/cloudfoundry-samples/hello-spring-cloud
cd hello-spring-cloud
```

### Build the application

Build the app using [Apache Maven](https://maven.apache.org).

```bash
mvn clean package
```

### Deploy the application with cf push

You can deploy most applications to Cloud Foundry using the `push` command:

```bash
cf push
```

When you *push* an application, Cloud Foundry detects the type of application (in this case, a Java app) and identifies its dependencies (in this case, the Spring framework). It then packages everything required to run your code into a standalone container image, known as a *droplet*. Finally, Cloud Foundry schedules the application on one of the available machines in your environment and creates a URL where you can reach it, which is available in the output of the command.

![Output from cf push command][cf-push-output]

To see the hello-spring-cloud application, open the provided URL in your browser:

![Default UI for Hello Spring Cloud][hello-spring-cloud-basic]

> [!NOTE] 
> To learn more about what happens during `cf push`, see [How Applications Are Staged][cf-push-docs] in the Cloud Foundry documentation.

## View application logs

You can use the Cloud Foundry CLI to view logs for an application by its name:

```bash
cf logs hello-spring-cloud
```

By default, the logs command uses *tail*, which shows new logs as they are written. To see new logs appear, refresh the hello-spring-cloud app in the browser.

To view logs that have already been written, add the `recent` switch:

```bash
cf logs --recent hello-spring-cloud
```

## Scale the application

By default, `cf push` only creates a single instance of your application. To ensure high availability and enable scale out for higher throughput, you generally want to run more than one instance of your applications. You can easily scale out already deployed applications using the `scale` command:

```bash
cf scale -i 2 hello-spring-cloud
```

Running the `cf app` command on the application shows that Cloud Foundry is creating another instance of the application. Once the application has started, Cloud Foundry automatically starts load balancing traffic to it.


## Next steps

- [Read the Cloud Foundry documentation][cloudfoundry-docs]
- [Set up the Azure DevOps Services plugin for Cloud Foundry][vsts-plugin]
- [Configure the Microsoft Log Analytics Nozzle for Cloud Foundry][loganalytics-nozzle]

<!-- LINKS -->

[pcf-azuremarketplace]: https://azuremarketplace.microsoft.com/marketplace/apps/pivotal.pivotal-cloud-foundry
[pcf-custom]: https://docs.pivotal.io/pivotalcf/1-10/customizing/azure.html
[oss-cf-bosh]: https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs
[pcf-azuremarketplace-pivotaldocs]: https://docs.pivotal.io/pivotalcf/customizing/pcf_azure.html
[cf-cli]: https://github.com/cloudfoundry/cli
[cloudshell-docs]: https://docs.microsoft.com/azure/cloud-shell/overview
[cf-orgs-spaces-docs]: https://docs.cloudfoundry.org/concepts/roles.html
[spring-boot]: https://projects.spring.io/spring-boot/
[spring-framework]: https://spring.io
[cf-push-docs]: https://docs.cloudfoundry.org/concepts/how-applications-are-staged.html
[cloudfoundry-docs]: https://docs.cloudfoundry.org
[vsts-plugin]: https://github.com/Microsoft/vsts-cloudfoundry
[loganalytics-nozzle]: https://github.com/Azure/oms-log-analytics-firehose-nozzle

<!-- IMAGES -->
[cf-push-output]: ./media/cloudfoundry-deploy-your-first-app/cf-push-output.png
[hello-spring-cloud-basic]: ./media/cloudfoundry-deploy-your-first-app/hello-spring-cloud-basic.png
