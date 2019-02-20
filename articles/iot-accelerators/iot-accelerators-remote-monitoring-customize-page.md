---
title: Add a page to the Remote Monitoring solution UI - Azure | Microsoft Docs 
description: This article shows you how to add a new page into the Remote Monitoring solution accelerator web UI.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/02/2018
ms.topic: conceptual

# As a developer, I want to add a new page to the solution accelerator web UI in order to start customizing the user experience.
---

# Add a custom page to the Remote Monitoring solution accelerator web UI

This article shows you how to add a new page into the Remote Monitoring solution accelerator web UI. The article describes:

- How to prepare a local development environment.
- How to add a new page to the web UI.

Other how-to guides extend this scenario to add more features to the page you add.

## Prerequisites

To complete the steps in this how-to guide, you need the following software installed on your local development machine:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/download/)

## Prepare a local development environment for the UI

The Remote Monitoring solution accelerator UI code is implemented using the [React](https://reactjs.org/) JavaScript framework. You can find the source code in the [Remote Monitoring WebUI](https://github.com/Azure/pcs-remote-monitoring-webui) GitHub repository.

To make and test changes to the UI, you can run it on your local development machine. Optionally, the local copy can connect to a deployed instance of the solution accelerator to enable it to interact with your real or simulated devices.

To prepare your local development environment, use Git to clone the [Remote Monitoring WebUI](https://github.com/Azure/pcs-remote-monitoring-webui) repository to your local machine:

```cmd/sh
git clone https://github.com/Azure/pcs-remote-monitoring-webui.git
```

## Add a page

To add a page to the web UI, you need to add the source files that define the page, and modify some existing files to make the web UI aware of the new page.

### Add the new files that define the page

To get you started, the **src/walkthrough/components/pages/basicPage** folder contains four files that define a simple page:

**basicPage.container.js**

[!code-javascript[Page container source](~/remote-monitoring-webui/src/walkthrough/components/pages/basicPage/basicPage.container.js?name=container "Page container source")]

**basicPage.js**

[!code-javascript[Basic page](~/remote-monitoring-webui/src/walkthrough/components/pages/basicPage/basicPage.js?name=page "Basic page")]

**basicPage.scss**

[!code-javascript[Page styling](~/remote-monitoring-webui/src/walkthrough/components/pages/basicPage/basicPage.scss?name=styles "Page styling")]

**basicPage.test.js**

[!code-javascript[Test code for basic page](~/remote-monitoring-webui/src/walkthrough/components/pages/basicPage/basicPage.test.js?name=test "Test code for basic page")]

Create a new folder **src/components/pages/example** and copy these four files into it.

### Add the new page to the web UI

To add the new page into the web UI, make the following changes to existing files:

1. Add the new page container to the **src/components/pages/index.js** file:

    ```js
    export * from './example/basicPage.container';
    ```

1. (Optional)  Add an SVG icon for the new page. For more information, see [webui/src/utilities/README.md](https://github.com/Azure/pcs-remote-monitoring-webui/blob/master/src/utilities/README.md). You can use an existing SVG file.

1. Add the page name to the translations file, **public/locales/en/translations.json**. The web UI uses [i18next](https://www.i18next.com/) for internationalization.

    ```json
    "tabs": {
      "basicPage": "Example",
    },
    ```

1. Open the **src/components/app.js** file that defines the top-level application page. Add the new page to the list of imports:

    ```javascript
    // Page Components
    import  {
      //...
      BasicPageContainer
    } from './pages';
    ```

1. In the same file, add the new page to the `pagesConfig` array. Set the `to` address for the route, reference the SVG icon and translations added previously, and set the `component` to the page's container:

    ```js
    const pagesConfig = [
      //...
      {
        to: '/basicpage',
        exact: true,
        svg: svgs.tabs.example,
        labelId: 'tabs.basicPage',
        component: BasicPageContainer
      },
      //...
    ];
    ```

1. Add any new breadcrumbs to the `crumbsConfig` array:

    ```js
    const crumbsConfig = [
      //...
      {
        path: '/basicpage', crumbs: [
          { to: '/basicpage', labelId: 'tabs.basicPage' }
        ]
      },
      //...
    ];
    ```

    This example page only has one breadcrumb, but some pages may have more.

Save all your changes. You're ready to run the web UI with your new page added.

### Test the new page

At a command prompt navigate to the root of your local copy of the repository, and run the following commands to install the required libraries and run the web UI locally:

```cmd/sh
npm install
npm start
```

The previous command runs the UI locally at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

Without connecting your local instance of the web UI to a deployed instance of the solution accelerator, you see errors on the dashboard. These errors don't affect your ability to test your new page.

You can now edit the code while the site is running locally and see the web UI update dynamically.

## [Optional] Connect to deployed instance

Optionally, you can connect your local running copy of the web UI to the Remote Monitoring solution accelerator in the cloud:

1. Deploy a **basic** instance of the solution accelerator using the **pcs** CLI. Make a note of the name of your deployment and the credentials you provided for the virtual machine. For more information, see [Deploy using the CLI](iot-accelerators-remote-monitoring-deploy-cli.md).

1. Use the Azure portal or the [az CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to enable SSH access to the virtual machine that hosts the microservices in your solution. For example:

    ```sh
    az network nsg rule update --name SSH --nsg-name {your solution name}-nsg --resource-group {your solution name} --access Allow
    ```

    You should only enable SSH access during test and development. If you enable SSH, [you should disable it again as soon as possible](../security/azure-security-network-security-best-practices.md).

1. Use the Azure portal or the [az CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to find the name and public IP address of your virtual machine. For example:

    ```sh
    az resource list --resource-group {your solution name} -o table
    az vm list-ip-addresses --name {your vm name from previous command} --resource-group {your solution name} -o table
    ```

1. Use SSH to connect to your virtual machine using the IP address from the previous step, and the credentials you provided when you ran **pcs** to deploy the solution.

1. To allow the local UX to connect, run the following commands at the bash shell in the virtual machine:

    ```sh
    cd /app
    sudo ./start.sh --unsafe
    ```

1. After you see the command completes and the web site starts, you can disconnect from the virtual machine.

1. In your local copy of the [Remote Monitoring WebUI](https://github.com/Azure/pcs-remote-monitoring-webui) repository, edit the **.env** file to add the URL of your deployed solution:

    ```config
    NODE_PATH = src/
    REACT_APP_BASE_SERVICE_URL=https://{your solution name}.azurewebsites.net/
    ```

## Next steps

In this article, you learned about the resources available to help you customize the web UI in the Remote Monitoring solution accelerator.

Now you have defined a page, the next step is to [Add a custom service to the Remote Monitoring solution accelerator web UI](iot-accelerators-remote-monitoring-customize-service.md) that retrieves data to display in the UI.

For more conceptual information about the Remote Monitoring solution accelerator, see [Remote Monitoring architecture](iot-accelerators-remote-monitoring-sample-walkthrough.md).
