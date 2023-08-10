---
title: Set up a lab to teach front-end development with React on Windows using Azure Lab Services
description: Learn how to set up labs to teach front-end development with React. 
author: emaher
ms.topic: how-to
ms.date: 05/16/2021
ms.service: lab-services
---

# Set up lab for React on Windows

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[React](https://reactjs.org/) is a popular JavaScript library for building user interfaces (UI). React is a declarative way to create reusable components for your website.  There are many other popular libraries for JavaScript-based front-end development.  We'll use a few of these libraries while creating our lab.  [Redux](https://redux.js.org/) is a library that provides predictable state container for JavaScript apps and is often used in compliment with React. [JSX](https://reactjs.org/docs/introducing-jsx.html) is a library syntax extension to JavaScript often used with React to describe what the UI should look like.  [NodeJS](https://nodejs.org/) is a convenient way to run a webserver for your React application.

This article will show how to install [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) for your development environment, and the tools, and libraries needed for a React web development class.

## Lab configuration

To set up this lab, you need an Azure subscription and lab plan to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Lab plan settings

Once you get have Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab account setting | Instructions |
| -------------------- | ----- |
| Marketplace image | Enable 'Visual Studio 2019 Community (latest release) on Windows Server 2019 (x64)' image. |

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).  Use the following settings when creating the lab.

| Lab setting | Value |
| ------------ | ------------------ |
| Virtual Machine Size | **Medium** |

We recommend testing your workloads to see if a larger size is needed.  For more information about each size, see [VM sizing](administrator-guide.md#vm-sizing).

## Template machine configuration

The steps in this section show how to complete the following to set up the template VM:

1. Install Development tools.
1. Install debugger extensions for your web browser.
1. Update firewall settings.

### Install Development tools

The 'Visual Studio 2019 Community (latest release) on Windows Server 2019 (x64)' image already has the required [**Node.js development** workload](/visualstudio/javascript/tutorial-nodejs-with-react-and-jsx?view=vs-2019&preserve-view=true#prerequisites) installed for [Visual Studio 2019](https://visualstudio.microsoft.com/vs/).

1. Install your preferred web browser.  The image has Internet Explorer installed by default.
1. Navigate to [Node.js](https://nodejs.org) website and select the **Download** button.  You can use the latest long-term service (LTS) version, current version with that latest features, or a previous release.  Installing NodeJS will also install [Node Package Manager](https://www.npmjs.com/), which will be used for installing the React, Redux, and JSX.
1. [Update Visual Studio 2019](/visualstudio/install/update-visual-studio?view=vs-2019&preserve-view=true) to the latest release, if needed.

Other components needed for a React-based website are installed using NPM into a specific application.  To add NPM packages, see [manage your NPM packages in Visual Studio](/visualstudio/javascript/npm-package-management?view=vs-2019&preserve-view=true#add-npm-packages).  

For example, if using the [Node.js Interactive Window](/visualstudio/javascript/nodejs-interactive-repl?view=vs-2019&preserve-view=true) in a project, enter the following commands to install the React, Redux, and JSX libraries:

```bash
.npm install react
.npm install react-dom
.npm install react-redux
.npm install react-jsx
```

To create your first Node.js with React app in Visual Studio, see [Tutorial: Create a Node.js and React app in Visual Studio](/visualstudio/javascript/tutorial-nodejs-with-react-and-jsx?view=vs-2019&preserve-view=true).

### Install debugger extensions

Install the React Developer Tools extensions for your browser so you can inspect React components and record performance information.  

- [React Developer Tools add-on for Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)
- [React Developer Tools Chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [React Developer Tools FireFox add-on](https://addons.mozilla.org/firefox/addon/react-devtools/)

### Update firewall settings

By default, inbound traffic to your Node.js server will be blocked.  If you wish to access a student's website while it's running, add an in-bound firewall rule to allow the traffic.  Look at the **Application Port** project property to see which port will be used during debugging.  The example below uses the [New-NetFirewallRule](/powershell/module/netsecurity/new-netfirewallrule?view=windowsserver2019-ps&preserve-view=true) PowerShell cmdlet to allow access to port 1337.  

```powershell
New-NetFirewallRule -DisplayName "Allow access to Port 1337" -Direction Inbound -LocalPort 1337 -Protocol TCP -Action Allow
```

>[!IMPORTANT]
>Educators must use the template VM or another lab VM to access a student's website.

## Cost

Let’s cover an example cost estimate for this class.  Suppose you have a class of 25 students. Each student has 20 hours of scheduled class time.  Another 10 quota hours for homework or assignments outside of scheduled class time is given to each student.  The virtual machine size we chose was **Medium**, which is 55 lab units.

- 25 students &times; (20 scheduled hours + 10 quota hours) &times; 55 Lab Units &times; USD0.01 per hour = 412.50 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
