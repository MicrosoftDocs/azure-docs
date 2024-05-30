---
title: "Quickstart: Deploy JBoss EAP on an Azure virtual machine (VM)"
description: Shows you how to quickly stand up JBoss EAP Server on an Azure virtual machine.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 05/29/2024
ms.service: virtual-machines
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm
---

# Quickstart: Deploy JBoss EAP on an Azure virtual machine (VM)

This article shows you how to quickly deploy JBoss Enterprise Application Platform (EAP) on an Azure virtual machine (VM) using the Azure portal.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
- Install [Azure CLI](/cli/azure/install-azure-cli).
- Install a Java Standard Edition (SE) implementation version 8 or later - for example, [Microsoft build of OpenJDK](/java/openjdk).
- Install [Maven](https://maven.apache.org/download.cgi), version 3.5.0 or higher.
- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

## Deploy JBoss EAP Server on Azure VM

The steps in this section direct you to deploy JBoss EAP Server on Azure VMs.

:::image type="content" source="media/jboss-eap-single-server-azure-vm/portal-start-experience.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM." lightbox="media/jboss-eap-single-server-azure-vm/portal-start-experience.png":::

The following steps show you how to find the JBoss EAP Server on Azure VM offer and fill out the **Basics** pane:

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP standalone on RHEL VM**. In the drop-down menu, ensure that **PAYG** is selected.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM in search results." lightbox="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png":::

   Alternatively, you can go directly to the [JBoss EAP standalone on RHEL VM](https://aka.ms/eap-vm-single-portal) offer. In this case, the correct plan is already selected for you.

   In either case, this offer deploys JBoss EAP by providing your Red Hat subscription at deployment time, and runs it on Red Hat Enterprise Linux using a pay-as-you-go payment configuration for the base VM.

1. On the offer page, select **Create**.
1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, `ejb0823jbosseapvm`.
1. Under **Instance details**, select the region for the deployment.
1. Leave the default VM size for **Virtual machine size**.
1. Leave the default option **OpenJDK 8** for **JDK version**.
1. Leave the default value **jbossuser** for **Username**.
1. Leave the default option **Password** for **Authentication type**.
1. Fill in password for **Password**. Use the same value for **Confirm password**.
1. Under **Optional Basic Configuration**, leave the default option **Yes** for **Accept defaults for optional configuration**.
1. Scroll to the bottom of the **Basics** pane and notice the helpful links for **Report issues, get help, and share feedback**.
1. Select **Next: JBoss EAP Settings**.

The following steps show you how to fill out **JBoss EAP Settings** pane and start the deployment.

1. Leave the default value **jbossadmin** for **JBoss EAP Admin username**.
1. Fill in JBoss EAP password for **JBoss EAP password**. Use the same value for **Confirm password**. Write down the value for later use.
1. Leave the default option **No** for **Connect to an existing Red Hat Satellite Server?**.
1. Select **Review + create**. Ensure the green **Validation Passed** message appears at the top. If the message doesn't appear, fix any validation problems, then select **Review + create** again.
1. Select **Create**.
1. Track the progress of the deployment on the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment might take up to 6 minutes to complete. After that, you should see text **Your deployment is complete** displayed on the deployment page.

## Optional: Verify the functionality of the deployment

1. Open the resource group you created in the Azure portal.
1. Select the VM resource named `jbosieapVm`.
1. In the **Overview** pane, note the **Public IP address** assigned to the network interface.
1. Copy the public IP address.
1. Paste the public IP address in an Internet-connected web browser, append `:9990`, and press **Enter**. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console sign-in screen, as shown in the following screenshot:

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png" alt-text="Screenshot of JBoss EAP management console sign-in screen." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png":::

1. Fill in the value of **JBoss EAP Admin username** which is **jbossadmin**. Fill in the value of **JBoss EAP password** you specified before for **Password**. Select **Sign in**.
1. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console welcome page as shown in the following screenshot.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png" alt-text="Screenshot of JBoss EAP management console welcome page." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png":::

> [!NOTE]
> You can also follow the guide [Connect to environments privately using Azure Bastion host and jumpboxes](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/connect-to-environments-privately) and visit the **Red Hat JBoss Enterprise Application Platform** management console with the URL `http://<private-ip-address-of-vm>:9990`.


## Optional: Deploy the app to the JBoss EAP Server

The following steps show you how to create a "Hello World" application and then deploy it on JBoss EAP:

1. Use the following steps to create a Maven project:

   1. Open a terminal or command prompt.

   1. Navigate to the directory where you want to create your project.

   1. Run the following Maven command to create a new Java web application. Be sure to replace `<package-name>` with your desired package name and `<project-name>` with your project name.

      ```bash
      mvn archetype:generate -DgroupId=<package-name> -DartifactId=<project-name> -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
      ```

1. Use the following steps to update the project structure:

   1. Navigate to the newly created project directory - for example, *helloworld*.

      The project directory has the following structure:

      ```
      helloworld
      ├── src
      │   └── main
      │       ├── java
      │       └── webapp
      │           └── WEB-INF
      │               └── web.xml
      └── pom.xml
      ```

1. Use the following steps to add a servlet class:

   1. In the *src/main/java* directory, create a new package - for example, `com.example`.

   1. Inside this package, create a new Java class named *HelloWorldServlet.java* with the following content:

      ```java
      package com.example;

      import java.io.IOException;
      import javax.servlet.ServletException;
      import javax.servlet.annotation.WebServlet;
      import javax.servlet.http.HttpServlet;
      import javax.servlet.http.HttpServletRequest;
      import javax.servlet.http.HttpServletResponse;

      @WebServlet("/hello")
      public class HelloWorldServlet extends HttpServlet {
          protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
              response.getWriter().print("Hello World!");
          }
      }
      ```

1. Use the following steps to update the *pom.xml* file:

   1. Add dependencies for Java EE APIs to your *pom.xml* file to ensure that you have the necessary libraries to compile the servlet:

      ```xml
      <dependencies>
          <dependency>
              <groupId>javax.servlet</groupId>
              <artifactId>javax.servlet-api</artifactId>
              <version>4.0.1</version>
              <scope>provided</scope>
          </dependency>
      </dependencies>
      ```

1. Build the project by running `mvn package` in the root directory of your project. This command generates a *.war* file in the *target* directory.

1. Use the following steps to deploy the application on JBoss EAP:

   1. Open the JBoss EAP admin console at `http://<public-ip-address-of-ipconfig1>:9990`.
   1. Deploy the *.war* file using the admin console by uploading the file in the **Deployments** section.

      :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-upload-content.png" alt-text="Screenshot of the JBoss EAP management console Deployments tab." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-upload-content.png":::

1. After deployment, access your "Hello World" application by navigating to `http://<public-ip-address-of-ipconfig1>:8080/helloworld/hello` in your web browser.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. Run the following command to remove the resource group, VM, network interface, virtual network, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

Learn more about migrating JBoss EAP applications to JBoss EAP on Azure VMs by following these links:

> [!div class="nextstepaction"]
> [Migrate JBoss EAP applications to JBoss EAP on Azure VMs](/azure/developer/java/migration/migrate-jboss-eap-to-jboss-eap-on-azure-vms?toc=/azure/virtual-machines/workloads/oracle/toc.json&bc=/azure/virtual-machines/workloads/oracle/breadcrumb/toc.json)
