---
title: "Tutorial: Deploy hybrid Next.js websites on Azure Static Web Apps"
description: "Generate and deploy Next.js hybrid sites with Azure Static Web Apps."
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 10/12/2022
ms.author: aapowell
ms.custom: devx-track-js
---


# Deploy hybrid Next.js websites on Azure Static Web Apps (Preview)

In this tutorial, you learn to deploy a [Next.js](https://nextjs.org) website to [Azure Static Web Apps](overview.md), using the support for Next.js features such as React Server Components, Server-Side Rendering (SSR), and API routes.

>[!NOTE]
> Next.js hybrid support is in preview.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.
- [Next.js CLI](https://nextjs.org/docs/getting-started) installed. Refer to the [Next.js Getting Started guide](https://nextjs.org/docs/getting-started) for details.

[!INCLUDE [Unsupported Next.js features](../../includes/static-web-apps-nextjs-unsupported.md)]

## Create a repository

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app to deploy to Azure Static Web Apps.

1. Navigate to the following location to create a new repository.

    [https://github.com/staticwebdev/nextjs-hybrid-starter/generate](https://github.com/login?return_to=%2Fstaticwebdev%2Fnextjs-hybrid-starter%2Fgenerate)

1. Name your repository **my-first-static-web-app**

1. Select **Create repository from template**.

    :::image type="content" source="media/getting-started/create-template.png" alt-text="Screenshot of create repository from template button.":::

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-basics.png" alt-text="Screenshot of the basics section in the Azure portal.":::

| Setting | Value |
|--|--|
| Subscription | Select your Azure subscription. |
| Resource Group | Select the **Create new** link, and enter **static-web-apps-test** in the textbox. |
| Name | Enter **my-first-static-web-app** in the textbox. |
| Plan type | Select **Free**. |
| Azure Functions and staging details | Select a region closest to you. |
| Source | Select **GitHub**. |

Select **Sign-in with GitHub** and authenticate with GitHub.

After you sign in with GitHub, enter the repository information.

| Setting | Value |
|--|--|
| Organization | Select your organization. |
| Repository| Select **my-first-web-static-app**. |
| Branch | Select **main**. |

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Screenshot of repository details in the Azure portal.":::

> [!NOTE]
> If you don't see any repositories:
> - You may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**.
> - You may need to authorize Azure Static Web Apps in your Azure DevOps organization. You must be an owner of the organization to grant the permissions. Request third-party application access via OAuth. For more information, see [Authorize access to REST APIs with OAuth 2.0](/azure/devops/integrate/get-started/authentication/oauth).

In the _Build Details_ section, add configuration details specific to your preferred front-end framework.

1. Select **Next.js** from the _Build Presets_ dropdown.

1. Keep the default value in the _App location_ box.

1. Leave the _Api location_ box empty.

1. Leave the _App artifact location_ box empty.

Select **Review + create**.

:::image type="content" source="media/getting-started-portal/review-create.png" alt-text="Screenshot of the create button.":::

## View the website

There are two aspects to deploying a static app. The first creates the underlying Azure resources that make up your app. The second is a workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

The Static Web Apps Overview window displays a series of links that help you interact with your web app.

:::image type="content" source="../../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Screenshot of Azure Static Web Apps overview window.":::

Selecting on the banner that says, Select here to check the status of your GitHub Actions runs takes you to the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can go to your website via the generated URL.

Once GitHub Actions workflow is complete, you can select the URL link to open the website in new tab.

## Set up your Next.js project locally to make changes

1. Clone the new repo to your machine. Make sure to replace <YOUR_GITHUB_ACCOUNT_NAME> with your account name.

    ```bash
    git clone http://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-first-static-web-app
    ```

1. Open the project in Visual Studio Code or your preferred code editor.

## Add Server-Rendered data with a Server Component

To add server-rendered data in your Next.js project using the App Router, edit a Next.js component to add a server-side operations to render data in the component. By default, Next.js components are [Server Components](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) that can be server-rendered.

1. Open the `app/page.tsx` file and add an operation that sets the value of a variable, which is computed server-side. Examples include fetching data or other server operations.

    ```ts
    export default function Home() {
        const timeOnServer = new Date().toLocaleTimeString('en-US');
        return(
            ...
        );
    }
    ```

1. Import `unstable_noStore` from `next/cache` and call it within the `Home` component to ensure the route is dynamically rendered.
   
    ```ts
    import { unstable_noStore as noStore } from 'next/cache';

    export default function Home() {
        noStore();
    
        const timeOnServer = new Date().toLocaleTimeString('en-US');
        return(
            ...
        );
    }
    ```

    >[!NOTE]
    >This example forces dynamic rendering of this component to demonstrate server-rendering of the server's current time. The App Router model of Next.js recommends caching individual data requests to optimize the performance of your Next.js app. Read more on [data fetching and caching in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating).

1. Update the `Home` component in _app/pages.tsx_ to render the server-side data. 

    ```ts
    import { unstable_noStore as noStore } from 'next/cache';

    export default function Home() {
        noStore();
    
        const timeOnServer = new Date().toLocaleTimeString('en-US');
        return(
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    This is a Next.js application hosted on Azure Static Web Apps with 
                    hybrid rendering. The time on the server is <strong>{timeOnServer}</strong>.
                </div>
            </main>
        );
    }
    ```

## Adding an API route

In addition to Server Components, Next.js provides [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) you can use to create API routes to your Next.js application. These APIs can be fetched in [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components).

Begin by adding an API route.

1. Create a new file at `app/api/currentTime/route.tsx`. This file holds the Route Handler for the new API endpoint.
1. Add a handler function to return data from the API.

    ```ts
    import { NextResponse } from 'next/server';

    export const dynamic = 'force-dynamic';

    export async function GET() { 
        const currentTime = new Date().toLocaleTimeString('en-US');

        return NextResponse.json({ 
            message: `Hello from the API! The current time is ${currentTime}.`
        });
    }
    ```

1. Create a new file at `app/components/CurrentTimeFromAPI.tsx`. This component creates a container for the Client Component that fetches the API from the browser.
1. Add a client component that fetches the API in this file.

    ```ts
    'use client';
    
    import { useEffect, useState } from 'react';
    
    export function CurrentTimeFromAPI(){
        const [apiResponse, setApiResponse] = useState('');
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            fetch('/api/currentTime')
                .then((res) => res.json())
                .then((data) => {
                setApiResponse(data.message);
                setLoading(false);
                });
            }, 
        []);
    
        return (
            <div className='pt-4'>
                The message from the API is: <strong>{apiResponse}</strong>
            </div>
        )
    }
    ```

This Client Component fetches the API with a `useEffect` React hook to render the component after the load is complete. The `'use client'` directive identifies this element as a Client Component. For more information, see [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components).

1. Edit _app/page.tsx_ to import and render the `CurrentTimeFromAPI` Client Component.

    ```ts
    import { unstable_noStore as noStore } from 'next/cache';
    import { CurrentTimeFromAPI } from './components/CurrentTimeFromAPI';

    export default function Home() {
        noStore();
    
        const timeOnServer = new Date().toLocaleTimeString('en-US');
        return(
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    This is a Next.js application hosted on Azure Static Web Apps with 
                    hybrid rendering. The time on the server is <strong>{timeOnServer}</strong>.
                </div>
                <CurrentTimeFromAPI />
            </main>
        );
    }
    ```
   
1. The result from the API route is displayed on the page.

:::image type="content" source="media/deploy-nextjs/nextjs-13-home-display.png" alt-text="Screenshot showing the display the output from the API route.":::

## Configure the runtime version for Next.js

Certain Next.js versions require specific Node.js versions. To configure a specific Node version, you can set the 'engines' property of your `package.json` file to designate a version.

```json
{
  ...
  "engines": {
    "node": "18.17.1"
  }
}
```

## Set environment variables for Next.js

Next.js uses environment variables at build time and at request time, to support both static page generation and dynamic page generation with server-side rendering. Therefore, set environment variables both within the build and deploy task, and in the _Environment variables_ of your Azure Static Web Apps resource. 

```yml
...
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          app_location: "/" 
          api_location: ""
          output_location: "" 
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_DATABASE: ${{ secrets.DB_DATABASE }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_PORT: ${{ secrets.DB_PORT }}
...
```

## Enable standalone feature

When your application size exceeds 250Mb, the Next.js [Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing) feature helps optimize the app size and enhance performance.

Output File Tracing creates a compressed version of the whole application with necessary package dependencies built into a folder named *.next/standalone*. This folder is meant to deploy on its own without additional *node_modules* dependencies.

In order to enable the `standalone` feature, add the following additional property to your `next.config.js`:
```js
module.exports ={
    output:"standalone",
}
```

You will also need to configure the `build` command in the `package.json` file in order to copy static files to your standalone output. 
```json
{
  ...
  "scripts": {
    ...
    "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/"
    ...
  }
  ...
}
```

## Configure your Next.js routing and middleware for deployment to Azure Static Web Apps

Your Next.js project can be configured to have custom handling of routes with redirects, rewrites, and middleware. These handlers are commonly used for authentication, personalization, routing, and internationalization.  Custom handling affects the default routing of your Next.js site and the configuration must be compatible with hosting on Static Web Apps.

Static Web Apps validates that your Next.js site is successfully deployed by adding a page to your site at build time. The page is named `public/.swa/health.html`, and Static Web Apps verifies the successful startup and deployment of your site by navigating to `/.swa/health.html` and verifying a successful response. Middleware and custom routing, which includes redirects and rewrites, can affect the access of the `/.swa/health.html` path, which can prevent Static Web Apps' deployment validation. To configure middleware and routing for a successful deployment to Static Web Apps, follow these steps:

1. Exclude routes starting with `.swa` in your `middleware.ts` (or `.js`) file in your middleware configuration.

    ```js
    export const config = {
      matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - .swa (Azure Static Web Apps)
         */
        '/((?!.swa).*)',
      ],
    }
    ```

1. Configure your redirects in `next.config.js` to exclude routes starting with `.swa`

    ```js
    module.exports = {
        async redirects() {
            return [
              {
                source: '/((?!.swa).*)<YOUR MATCHING RULE>',
                destination: '<YOUR REDIRECT RULE>', 
                permanent: false,
              },
            ]
        },
    };
    ```

1. Configure your rewrites in `next.config.js` to exclude routes starting with `.swa`

    ```js
    module.exports = {
        async rewrites() {
            return {
                beforeFiles: [
                    {
                        source: '/((?!.swa).*)<YOUR MATCHING RULE>',
                        destination: '<YOUR REWRITE RULE>', 
                    }
                ]
            }
        },
    };
    ```
These code snippets exclude paths that start with `.swa` from being handled by your custom routing or middleware. These rules ensure that the paths resolve as expected during deployment validation.

## Enable logging for Next.js

Following best practices for Next.js server API troubleshooting, add logging to the API to catch these errors. Logging on Azure uses **Application Insights**. In order to preload this SDK, you need to create a custom start up script. To learn more:

* [Example preload script for Application Insights + Next.js](https://medium.com/microsoftazure/enabling-the-node-js-application-insights-sdk-in-next-js-746762d92507)
* [GitHub issue](https://github.com/microsoft/ApplicationInsights-node.js/issues/808)
* [Preloading with Next.js](https://jake.tl/notes/2021-04-04-nextjs-preload-hack)

## Clean up resources

[!INCLUDE [clean up](../../includes/static-web-apps/static-web-apps-tutorials-portal-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](./application-settings.md)
