---
title: Set up a lab with React on Linux using Azure Lab Services
description: Learn how to set up labs to React development class. 
author: emaher
ms.topic: article
ms.date: 05/16/2021
ms.author: enewman
---

# Set up lab for React on Linux

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces (UI). React is a declarative way to create reusable components for your website.  There are many other popular libraries for JavaScript-based front-end development.  We'll use a few of these libraries while creating our lab.  [Redux](https://redux.js.org/) is a library that provides predictable state container for JavaScript apps and is often used in compliment with React. [JSX](https://reactjs.org/docs/introducing-jsx.html) is a library syntax extension to JavaScript often used with React to describe what the UI should look like.  [NodeJS](https://nodejs.org/) is a convenient way to run a webserver for your React application.

This article will show how to install [Visual Studio Code](https://code.visualstudio.com/) for your development environment, the tools, and libraries needed for a React web development class.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see the tutorial on [how to setup a lab account](./tutorial-setup-lab-account.md). You can also use an existing lab account.

### Lab account settings

Enable your lab account settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab account setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the 'Ubuntu Server 18.04 LTS' image for use within your lab account. |

### Lab settings

The size of the virtual machine (VM) that we recommend depends on the types of workloads that your students need to do.  

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | **Small**.|

We recommend testing your workloads to see if a larger size is needed.  For more information about each size, see [VM sizing](administrator-guide.md#vm-sizing).

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

[Create React App](https://create-react-app.dev/) is an officially supported way to create a ReactApp and requires no further configuration if using npm 5.2 and above.  For instructions using Create React App, see their [getting started](https://create-react-app.dev/docs/getting-started) documentation.

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

To run the app in development mode, use the `npm start` built-in command.  The local and network urls will be listed in the command output.  To use HTTPS instead of HTTP, see [create React app using https in development](https://create-react-app.dev/docs/using-https-in-development).

### Update firewall settings

Official Ubuntu builds have [iptables](https://help.ubuntu.com/community/IptablesHowTo) installed and will allow all incoming traffic by default.  However, if you're using a VM that has a more restrictive firewall, add an inbound rule to allow traffic to the NodeJS server.  The example below uses [iptables](https://help.ubuntu.com/community/IptablesHowTo) to allow traffic to port 3000.

```bash
sudo iptables -I INPUT -p tcp -m tcp --dport 3000 -j ACCEPT
```

>[!IMPORTANT]
>Instructors must use the template VM or another lab VM to access a student's website.

## Cost

Let’s cover an example cost estimate for this class.  Suppose you have a class of 25 students. Each student has 20 hours of scheduled class time.  Another 10 quota hours for homework or assignments outside of scheduled class time is given to each student.  The virtual machine size we chose was **Small**, which is 20 lab units.

- 25 students &times; (20 scheduled hours + 10 quota hours) &times; 20 Lab Units &times; USD0.01 per hour = 150.00 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

The template image can now be published to the lab. See [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) for further instructions.

As you set up your lab, see the following articles:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quotas](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
