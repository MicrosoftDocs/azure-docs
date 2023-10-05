---
title: Set up a lab with React on Linux using Azure Lab Services
description: Learn how to set up labs to React development class. 
author: emaher
ms.topic: how-to
ms.date: 04/25/2022
ms.custom: devdivchpfy22
ms.service: lab-services
---

# Set up lab for React on Linux

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces (UI). React is a declarative way to create reusable components for your website. There are many other popular libraries for JavaScript-based front-end development. We'll use a few of these libraries while creating our lab. [Redux](https://redux.js.org/) is a library that provides predictable state container for JavaScript apps and is often used in compliment with React. [JSX](https://reactjs.org/docs/introducing-jsx.html) is a library syntax extension to JavaScript often used with React to describe what the UI should look like. [NodeJS](https://nodejs.org/) is a convenient way to run a webserver for your React application.

This article shows you how to install [Visual Studio Code](https://code.visualstudio.com/) for your development environment, the tools, and libraries needed for a React web development class.

## Lab configuration

To set up this lab, you need an Azure subscription to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Lab plan settings

Once you have an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information on creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the 'Ubuntu Server 18.04 LTS' image. |

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md). Use the following settings when creating the lab.

| Lab setting | Value |
| ------------ | ------------------ |
| Virtual Machine Size | **Small** |

We recommend that you test your workloads to see if a larger size is needed. For more information about each size, see [VM sizing](administrator-guide.md#vm-sizing).

## Template machine configuration

The steps in this section show how to complete the following to set up the template VM:

1. Install Development tools.
1. Install debugger extensions for your web browser.
1. Update firewall settings.

### Install Development tools

1. Install your preferred web browser.  
1. Install [Node.js](https://nodejs.org).

    ```bash
    sudo apt install nodejs
    ```

1. Install [Node Package Manager](https://www.npmjs.com/), which will be used for installing the React, Redux, and JSX.

    ```bash
    sudo apt install npm
    ```

1. Install [Visual Studio Code](https://code.visualstudio.com/docs/setup/linux).
1. Install [Reactive Native Tools extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native).
1. Optionally, install extensions for development with [Redux](https://marketplace.visualstudio.com/search?term=Redux&target=VSCode&category=All%20categories&sortBy=Relevance) and [JSX](https://marketplace.visualstudio.com/search?term=JSX&target=VSCode&category=All%20categories&sortBy=Relevance).

[Create React App](https://create-react-app.dev/) is an officially supported way to create a React app and requires no further configuration if you're using npm 5.2 and above. For more instructions on how to use Create React App, see their [getting started](https://create-react-app.dev/docs/getting-started) documentation.

Other components needed for a React-based website are installed using NPM into a specific application. For example, enter the following commands to install the Redux and JSX libraries:

```bash
npm install react-redux
npm install react-jsx
```

### Install debugger extensions

Install the React Developer Tools extensions for your browser so you can inspect React components and record performance information.  

- [React Developer Tools Edge add-on](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)
- [React Developer Tools Chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [React Developer Tools FireFox add-on](https://addons.mozilla.org/firefox/addon/react-devtools/)

To run the app in development mode, use the `npm start` built-in command. The local and network urls will be listed in the command output. For more information on how to use HTTPS instead of HTTP, see [Create React App: Using HTTPS in Development](https://create-react-app.dev/docs/using-https-in-development).

### Update firewall settings

Official Ubuntu builds have [iptables](https://help.ubuntu.com/community/IptablesHowTo) installed and will allow all incoming traffic by default. However, if you're using a VM that has a more restrictive firewall, add an inbound rule to allow traffic to the NodeJS server. The example below uses [iptables](https://help.ubuntu.com/community/IptablesHowTo) to allow traffic to port 3000.

```bash
sudo iptables -I INPUT -p tcp -m tcp --dport 3000 -j ACCEPT
```

>[!IMPORTANT]
>Educators must use the template VM or another lab VM to access a student's website.

## Cost

Let's cover an example cost estimate for this class. The virtual machine size we chose was **Small**, which is 20 lab units.

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the cost estimate would be:

25 students &times; (20 scheduled hours + 10 quota hours) &times; 20 Lab Units &times; USD0.01 per hour = 150.00 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only. For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
