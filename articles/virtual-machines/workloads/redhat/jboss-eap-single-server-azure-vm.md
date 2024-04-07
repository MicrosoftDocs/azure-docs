---
title: "Quickstart: Deploy JBoss EAP Server on Azure VM using the Azure portal"
description: Shows you how to quickly stand up JBoss EAP Server on an Azure virtual machine.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 01/03/2024
ms.service: virtual-machines
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm
---

# Quickstart: Deploy JBoss EAP Server on an Azure virtual machine using the Azure portal

This article shows you how to quickly deploy JBoss EAP Server on an Azure virtual machine (VM) using the Azure portal.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
- [Azure CLI installed](/cli/azure/install-azure-cli)
- Install a Java SE implementation version 8 or later (for example, [Microsoft build of OpenJDK](/java/openjdk)).
- Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

## Deploy JBoss EAP Server on Azure VM

The steps in this section direct you to deploy JBoss EAP Server on Azure VMs.

:::image type="content" source="media/jboss-eap-single-server-azure-vm/portal-start-experience.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM." lightbox="media/jboss-eap-single-server-azure-vm/portal-start-experience.png":::

The following steps show you how to find the JBoss EAP Server on Azure VM offer and fill out the **Basics** pane.

1. In the search bar at the top of the Azure portal, enter *JBoss EAP*. In the search results, in the **Marketplace** section, select **JBoss EAP standalone on RHEL VM**.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png" alt-text="Screenshot of Azure portal showing JBoss EAP Server on Azure VM in search results." lightbox="media/jboss-eap-single-server-azure-vm/marketplace-search-results.png":::

   In the drop-down menu, ensure **PAYG** is selected.

   Alternatively, you can also go directly to the [JBoss EAP standalone on RHEL VM](https://aka.ms/eap-vm-single-portal) offer. In this case, the correct plan is already selected for you.

   In either case, this offer deploys JBoss EAP by providing your Red Hat subscription at deployment time, and runs it on Red Hat Enterprise Linux using a pay-as-you-go payment configuration for the base VM.

1. On the offer page, select **Create**.
1. On the **Basics** pane, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, today's date, and some identifier. For example, *ejb0823jbosseapvm*.
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

Depending on network conditions and other activity in your selected region, the deployment may take up to 6 minutes to complete. After that, you should see text **Your deployment is complete** displayed on the deployment page.

## Optional: Verify the functionality of the deployment

By default, the JBoss EAP Server is deployed on an Azure VM in a dedicated virtual network without public access. If you want to verify the functionality of the deployment by viewing the **Red Hat JBoss Enterprise Application Platform** management console, use the following steps to assign the VM a public IP address for access.

1. On the deployment page, select **Deployment details** to expand the list of Azure resource deployed. Select network security group `jbosseap-nsg` to open its details page.
1. Under **Settings**, select **Inbound security rules**. Select **+ Add** to open **Add inbound security rule** panel for adding a new inbound security rule.
1. Fill in *9990,8080* for **Destination port ranges**. Fill in *Port_jbosseap* for **Name**. Select **Add**. Wait until the security rule created.
1. Select **X** icon to close the network security group `jbosseap-nsg` details page. You're switched back to the deployment page.
1. Select the resource ending with `-nic` (with type `Microsoft.Network/networkInterfaces`) to open its details page.
1. Under **Settings**, select **IP configurations**. Select `ipconfig1` from the list of IP configurations to open its configuration details panel.
1. Under **Public IP address**, select **Associate**. Select **Create new** to open the **Add a public IP address** popup. Fill in *jbosseapvm-ip* for **Name**. Select **Static** for **Assignment**. Select **OK**.
1. Select **Save**. Wait until the public IP address created and the update completes. Select the **X** icon to close the IP configuration page.
1. Copy the value of the public IP address from the **Public IP address** column for `ipconfig1`. For example, `20.232.155.59`.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/public-ip-address.png" alt-text="Screenshot of public IP address assigned to the network interface." lightbox="media/jboss-eap-single-server-azure-vm/public-ip-address.png":::

1. Paste the public IP address in an Internet-connected web browser, append `:9990`, and press **Enter**. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console sign-in screen, as shown in the following screenshot.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png" alt-text="Screenshot of JBoss EAP management console sign-in screen." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-login.png":::

1. Fill in the value of **JBoss EAP Admin username** which is **jbossadmin**. Fill in the value of **JBoss EAP password** you specified before for **Password**. Select **Sign in**.
1. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console welcome page as shown in the following screenshot.

   :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png" alt-text="Screenshot of JBoss EAP management console welcome page." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-welcome.png":::

> [!NOTE]
> You can also follow the guide [Connect to environments privately using Azure Bastion host and jumpboxes](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/connect-to-environments-privately) and visit the **Red Hat JBoss Enterprise Application Platform** management console with the URL `http://<private-ip-address-of-vm>:9990`.


## Optional: Deploy the app to the JBoss EAP Server

The following steps will guide you to create a "Hello World" application and then deploy it on JBoss EAP.

2. **Create a Maven Project:**

   - Open a terminal or command prompt.

   - Navigate to the directory where you want to create your project.

   - Run the following Maven command to create a new Java web application:

     ```bash
     mvn archetype:generate -DgroupId=com.example -DartifactId=helloworld -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
     ```

     Replace `com.example` with your desired package name and `helloworld` with your project name.

3. **Project Structure:**

   - Navigate to the newly created project directory (`helloworld`).

   - The project directory will have the following structure:

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

4. **Add a Servlet Class:**

   - In the `src/main/java` directory, create a new package (e.g., `com.example`).

   - Inside this package, create a new Java class, `HelloWorldServlet.java`, with the following content:

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

5. **Update `pom.xml`:**

   - Add dependencies for Java EE APIs to your `pom.xml` file to ensure you have the necessary libraries to compile the servlet:

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

6. **Build the Project:**

   - Run `mvn package` in the root directory of your project to build the application. This will generate a `.war` file in the `target` directory.

7. **Deploy the Application on JBoss EAP:**
  - Open the JBoss EAP admin console (`http://<public-ip-address-of-ipconfig1>:9990`).
  - Deploy the `.war` file using the admin console by uploading the file in the "Deployments" section.
      :::image type="content" source="media/jboss-eap-single-server-azure-vm/jboss-eap-console-upload-content.png" alt-text="Screenshot of the JBoss EAP management console Deployments tab with Upload Content menu item highlighted." lightbox="media/jboss-eap-single-server-azure-vm/jboss-eap-console-upload-content.png":::

8. **Access the Application:**
   - Once deployed, you can access your "Hello World" application by navigating to `http://<public-ip-address-of-ipconfig1>:8080/helloworld/hello` in your web browser.


## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. 

Run the following command to remove the resource group, VM, network interface, virtual network, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

Learn more about migrating JBoss EAP applications to JBoss EAP on Azure VMs by following these links:

> [!div class="nextstepaction"]
> [Migrate JBoss EAP applications to JBoss EAP on Azure VMs](/azure/developer/java/migration/migrate-jboss-eap-to-jboss-eap-on-azure-vms?toc=/azure/virtual-machines/workloads/oracle/toc.json&bc=/azure/virtual-machines/workloads/oracle/breadcrumb/toc.json)
