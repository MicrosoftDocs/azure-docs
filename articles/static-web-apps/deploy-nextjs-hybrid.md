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


# Deploy hybrid Next.js websites on Azure Static Web Apps

In this tutorial, you learn to deploy a [Next.js](https://nextjs.org) website to [Azure Static Web Apps](overview.md), leveraging the support for Next.js features such as Server-Side Rendering (SSR) and API routes.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.
- [Next.js CLI](https://nextjs.org/docs/getting-started) installed. Refer to the [Next.js Getting Started guide](https://nextjs.org/docs/getting-started) for details.

[!INCLUDE [Unsupported Next.js features](../../includes/static-web-apps-nextjs-unsupported.md)]

## Set up a Next.js app

Begin by initializing a new Next.js application.

1. Initialize the application using `npm init`. If you are prompted to install `create-next-app`, say yes.

    ```bash
    npm init next-app@next-12-3-2 --typescript
    ```

1. When prompted for an app name, enter **nextjs-app**.

1. Navigate to the folder containing the new app:

    ```bash
    cd nextjs-app
    ```

1. Start Next.js app in development:

    ```bash
    npm run dev
    ```

    Navigate to `http://localhost:3000` to open the app, where you should see the following website open in your browser:

    :::image type="content" source="media/deploy-nextjs/nextjs-hybrid-starter.png" alt-text="Screenshot of a Next.js app running in the browser.":::

1. Stop the development server by pressing **CMD/CTRL + C**.

## Configure your Next.js app for deployment to Static Web Apps

To configure your Next.js app for deployment to Static Web Apps, enable the standalone feature for your Next.js project. This step reduces the size of your Next.js project to ensure it's below the size limits for Static Web Apps. Refer to the [standalone](#enable-standalone-feature) section for more information.

```js
module.exports = {
    output: "standalone",
}
```

## Deploy your Next.js app

The following steps show how to link your app to Azure Static Web Apps. Once in Azure, you can deploy the application to a production environment.

### Create a GitHub repo

Before deploying to Azure, you'll need to create a GitHub repo and push the application up.

1. Navigate to [https://github.com/new](https://github.com/new) and name it **nextjs-app**.
1. From the terminal on your machine, initialize a local git repo and commit your changes using the following command.

    ```bash
    git init && git add -A && git commit -m "initial commit"
    ```

1. Add your repo as a remote and push your changes to the server.

    ```bash
    git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/nextjs-app && git push -u origin main
    ```

    As you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub user name.

[!INCLUDE [create a static web app initial steps](../../includes/static-web-apps/create-a-static-web-app.md)]

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select the appropriate GitHub organization. |
    | _Repository_ | Select **nextjs-app**. |
    | _Branch_ | Select **main**. |

1. In the _Build Details_ section, select **Next.js** from the _Build Presets_ and keep the default values.

### Review and create

1. Select the **Review + Create** button to verify the details are all correct.

1. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Action for deployment.

1. Once the deployment completes select, **Go to resource**.

1. On the _Overview_ window, select the *URL* link to open your deployed application.

If the website doesn't load immediately, then the build is still running.

To check the status of the Actions workflow, navigate to the Actions dashboard for your repository:

```url
https://github.com/<YOUR_GITHUB_USERNAME>/nextjs-app/actions
```

Once the workflow is complete, you can refresh the browser to view your web app.

Now any changes made to the `main` branch starts a new build and deployment of your website.


>[!NOTE]
>If you have trouble deploying a Next.js Hybrid application with more than 100Mb app size, use the `standalone` feature of Next.js. Refer to the [standalone](#enable-standalone-feature) section for more information. 


### Sync changes

When you created the app, Azure Static Web Apps created a GitHub Actions file in your repository. Synchronize with the server by pulling down the latest to your local repository.

Return to the terminal and run the following command `git pull origin main`.


## Add Server-Rendered data

To insert data server-rendered data to a Next.js page, you need to first export a special function.

1. Open the _pages/index.ts_ file and add an exported function named `getServerSideProps`.

    ```ts
    export async function getServerSideProps() {
        const data = JSON.stringify({ time: new Date() });
        return { props: { data } };
    }
    ```

1. Update the `Home` component to receive the server-rendered data.

    ```ts
    export default function Home({ data }: { data: { time: string } }) {
        const serverData = JSON.parse(data);

        return (
            <div className={styles.container}>
                <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Welcome to <a href="https://nextjs.org">Next.js! The time is {serverData.time}</a>
                    </h1>
                // snip
    ```

1. Commit and push the changes.

Once the changes are pushed, a new GitHub Actions workflow begins and the changes are deployed to your site.

## Adding an API route

Next.js has [API routes](https://nextjs.org/docs/api-routes/introduction) which is an alternative to Azure Functions for creating APIs for the Next.js client application.

Begin by adding an API route.

1. Create a new file at _pages/api/time.ts_.
1. Add a handler function to return data from the API.

    ```ts
    import type { NextApiRequest, NextApiResponse } from "next";

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.status(200).json({ time: new Date() });
    }
    ```

1. Open _pages/index.ts_ to add a call to the API, and display the result.

    ```ts
    export default function Home({ data }: { data: { time: string } }) {
        const [time, setTime] = useState<Date | null>(null);
        useEffect(() => {
            fetch('/api/time')
            .then(res => res.json())
            .then(json => setTime(new Date(json.time)));
        }, []);
        return (
            <div className={styles.container}>
                <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                    Welcome to{" "}
                    <a href="https://nextjs.org">
                        Next.js!{" "}
                        {time &&
                        `The time is ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
                    </a>
                    </h1>
                    // snip
    }
    ```

1. The result from the API route will be displayed on the page.

:::image type="content" source="media/deploy-nextjs/nextjs-api-route-display.png" alt-text="Display the output from the API route":::

## Enable standalone feature

When your application size exceeds 100Mb, the Next.js [Output File Tracing](https://nextjs.org/docs/advanced-features/output-file-tracing) feature helps optimize the app size and enhance performance.

Output File Tracing creates a compressed version of the whole application with necessary package dependencies built into a folder named *.next/standalone*. This folder is meant to deploy on its own without additional *node_modules* dependencies.

In order to enable the `standalone` feature, add the following additional property to your `next.config.js`:
```bash
module.exports ={
    output:"standalone",
}
```

## Enable logging for Next.js

Following best practices for Next.js server API troubleshooting, add logging to the API to catch these errors. Logging on Azure uses **Application Insights**. In order to preload this SDK, you need to create a custom start up script. To learn more:

* [Example preload script for Application Insights + Next.js](https://medium.com/microsoftazure/enabling-the-node-js-application-insights-sdk-in-next-js-746762d92507)
* [GitHub issue](https://github.com/microsoft/ApplicationInsights-node.js/issues/808)
* [Preloading with Next.js](https://jake.tl/notes/2021-04-04-nextjs-preload-hack)


## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-nextjs-group** from the top search bar.
1. Select on the group name.
1. Select on the **Delete** button.
1. Select **Yes** to confirm the delete action.

> [!div class="nextstepaction"]
> [Set up a custom domain](custom-domain.md)
