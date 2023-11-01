---
title: Get started
description: Learn to build and deploy a CCF JavaScript application
author: msftsettiy
ms.author: settiy
ms.date: 09/30/2023
ms.service: confidential-ledger
ms.topic: how-to
ms.custom: devx-track-azurecli
---

# Build, test and deploy a TypeScript and JavaScript application

This guide shows the steps to develop a TypeScript and JavaScript application targeting CCF, debug it locally and deploy it to a Managed CCF resource on the cloud.

## Prerequisites

- [Install CCF](https://github.com/Microsoft/CCF/releases)
- Node.js
- npm
- [!INCLUDE [Prerequisites](./includes/proposal-prerequisites.md)]

> This guide uses [Visual Studio Code](https://code.visualstudio.com/) as the IDE. But, any IDE with support for Node.js, JavaScript and TypeScript application development can be used.

## Project set up

1. Follow the [instructions](https://microsoft.github.io/CCF/main/build_apps/js_app_ts.html#conversion-to-an-app-bundle) in the CCF documentation to bootstrap the project and set up the required folder structure.

## Develop the application

1. Develop the TypeScript application by following the documentation [here](https://microsoft.github.io/CCF/main/build_apps/js_app_ts.html). Refer to the [CCF Key-Value store](https://microsoft.github.io/CCF/main/build_apps/kv/index.html) documentation to learn about the naming standards and transaction semantics to use in the code. For examples and best practices, refer to the [sample applications](https://github.com/microsoft/ccf-app-samples) published in GitHub.

## Build the application bundle

1. The native format for JavaScript applications in CCF is a JavaScript application bundle, or short app bundle. A bundle can be wrapped directly into a governance proposal for deployment. Follow the instruction at [create an application bundle](https://microsoft.github.io/CCF/main/build_apps/js_app_bundle.html) in the CCF documentation to create an app bundle and prepare for deployment. 

2. Build the application. The application bundle is created in the dist folder. The application bundle is placed in a file named set_js_app.json.

```bash
npm run build

> build
> del-cli -f dist/ && rollup --config && cp app.json dist/ && node build_bundle.js dist/


src/endpoints/all.ts → dist/src...
created dist/src in 1.3s
Writing bundle containing 8 modules to dist/bundle.json
ls -ltr dist
total 40
drwxr-xr-x 4 settiy settiy  4096 Sep 11 10:20 src
-rw-r--r-- 1 settiy settiy  3393 Sep 11 10:20 app.json
-rw-r--r-- 1 settiy settiy 16146 Sep 11 10:20 set_js_app.json
-rw-r--r-- 1 settiy settiy 16061 Sep 11 10:20 bundle.json
```

### Logging

1. CCF provides macros to add your own lines to the node’s output. Follow the instructions available at [add logging to an application](https://microsoft.github.io/CCF/main/build_apps/logging.html) in the CCF documentation. 

## Deploy a 1-node CCF network

1. Run the /opt/ccf_virtual/bin/sandbox.sh script to start a 1-node CCF network and deploy the application bundle.

```bash
sudo /opt/ccf_virtual/bin/sandbox.sh --js-app-bundle ~/ccf-app-samples/banking-app/dist/
Setting up Python environment...
Python environment successfully setup
[10:40:37.516] Virtual mode enabled
[10:40:37.517] Starting 1 CCF node...
[10:40:41.488] Started CCF network with the following nodes:
[10:40:41.488]   Node [0] = https://127.0.0.1:8000
[10:40:41.489] You can now issue business transactions to the libjs_generic application
[10:40:41.489] Loaded JS application: /home/demouser/ccf-app-samples/banking-app/dist/
[10:40:41.489] Keys and certificates have been copied to the common folder: /home/demouser/ccf-app-samples/banking-app/workspace/sandbox_common
[10:40:41.489] See https://microsoft.github.io/CCF/main/use_apps/issue_commands.html for more information
[10:40:41.490] Press Ctrl+C to shutdown the network
```

2. The member certificate and the private key are available at /workspace/sandbox_0. The application log is available at /workspace/sandbox_0/out.

:::image type="content" source="media/sandbox-workspace.png" alt-text="A picture showing the out file where the CCF node and application logs are written to.":::

3. At this point, we have created a local CCF network with one member and deployed the application. The network endpoint is `https://127.0.0.1:8000`. The member can participate in governance operations like updating the application or adding more members by submitting a proposal.

```Bash
curl -k --silent https://127.0.0.1:8000/node/version | jq
{
  "ccf_version": "ccf-4.0.7",
  "quickjs_version": "2021-03-27",
  "unsafe": false
}
```

4. Download the service certificate from the network.

```bash
curl -k https://127.0.0.1:8000/node/network | jq -r .service_certificate > service_certificate.pem
```

## Update the application

1. Application development is an iterative process. When new features are added or bugs are fixed, the application must be redeployed to the 1-node network which can be done with a set_js_app proposal.

2. Rebuild the application to create a new set_js_app.json file in the dist folder.

3. Create a proposal to submit the application. After the proposal is accepted, the new application is deployed to the 1-node network.

> [!NOTE]
> On a local 1-node network, a proposal is immediately accepted after it is submitted. There isn't a need to submit a vote to accept or reject the proposal. The rationale behind it is done to make the development process quick. However, this is different from how the governance works in Azure Managed CCF where member(s) must submit a vote to accept or reject a proposal.

```Bash
$ ccf_cose_sign1 --content dist/set_js_app.json --signing-cert workspace/sandbox_common/member0_cert.pem --signing-key workspace/sandbox_common/member0_privk.pem --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` | curl https://127.0.0.1:8000/gov/proposals -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem
```

## Deploy the application to a Managed CCF resource

The next step is to [create a Managed CCF resource](quickstart-portal.md) and deploy the application by following the instructions at [deploy a JavaScript application](quickstart-deploy-application.md).

## Next steps

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Create an Azure Managed CCF resource using the Azure portal](quickstart-portal.md)
- [Quickstart: Deploy a JavaScript application to Azure Managed CCF](quickstart-deploy-application.md)
- [How to: Update the JavaScript runtime options](how-to-update-javascript-runtime-options.md)
