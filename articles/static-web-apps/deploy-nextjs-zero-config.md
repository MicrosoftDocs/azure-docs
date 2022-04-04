---
title: "Tutorial: Deploy zero-config Next.js websites on Azure Static Web Apps"
description: "Generate and deploy Next.js dynamic sites with Azure Static Web Apps."
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 03/26/2022
ms.author: aapowell
ms.custom: devx-track-js
---


# Deploy zero-config Next.js websites on Azure Static Web Apps

In this tutorial, you learn to deploy a [Next.js](https://nextjs.org) website to [Azure Static Web Apps](overview.md), leveraging the zero-config support for dynamic Next.js features such as Server-Side Rendering (SSR) and API routes.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.

## Set up a Next.js app

This tutorial will be using the Next.js CLI to create your app. For full information on getting started, refer to the [Next.js Getting Started guide](https://nextjs.org/docs/getting-started).

1. Create a Next.js app using `create-next-app` and follow the prompts:

    ```bash
    npm init next-app@latest --typescript
    ```

1. Navigate to the folder containing the new app:

    ```bash
    cd <application-folder>
    ```

1. Start Next.js app in development:

    ```bash
    npm run dev
    ```

Navigate to `http://localhost:3000` to open the app, where you should see the following website open in your preferred browser:

:::image type="content" source="media/deploy-nextjs/start-nextjs-app.png" alt-text="Start Next.js app":::

When you select a framework or library, you see a details page about the selected item:

:::image type="content" source="media/deploy-nextjs/start-nextjs-details.png" alt-text="Details page":::

## Deploy your static website

The following steps show how to link your app to Azure Static Web Apps. Once in Azure, you can deploy the application to a production environment.

## Create a GitHub repo

Before deploying to Azure, you'll need to create a GitHub repo and push the application up.

1. Navigate to [https://github.com/new](https://github.com/new) and provide a name for the repo (eg: `nextjs-app`).
1. From the terminal on your machine, initalise a local git repo and commit the application:

    ```bash
    git init && git add -A && git commit -m "initial commit"
    ```

1. Add your repo as a remote and push to it:

    ```bash
    git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/nextjs-app && git push -u origin main
    ```

### Create a static app

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **my-nextjs-group**  |
    | _Name_ | **my-nextjs-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select the appropriate GitHub organization. |
    | _Repository_ | Select **nextjs-app**. |
    | _Branch_ | Select **main**. |

1. In the _Build Details_ section, select **Custom** from the _Build Presets_. Add the following values as for the build configuration.

    | Property | Value |
    | --- | --- |
    | _App location_ | Enter **/** in the box. |
    | _Api location_ | Leave this box empty. |
    | _Output location_ | Enter **out** in the box. |

### Review and create

1. Select the **Review + Create** button to verify the details are all correct.

1. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Action for deployment.

1. Once the deployment completes select, **Go to resource**.

1. On the _Overview_ window, select the *URL* link to open your deployed application.

If the website doesn't load immediately, then the build is still running. Once the workflow is complete, you can refresh the browser to view your web app.

To check the status of the Actions workflow, navigate to the Actions dashboard for your repository:

```url
https://github.com/<YOUR_GITHUB_USERNAME>/nextjs-app/actions
```

Now any changes made to the `main` branch start a new build and deployment of your website.

### Sync changes

When you created the app, Azure Static Web Apps created a GitHub Actions file in your repository. Synchronize with the server by pulling down the latest to your local repository.

Return to the terminal and run the following command `git pull origin main`.

## Add Server-Rendered data

To insert data that is server-rendered to a Next.js page, a special function needs to be exported.

1. Open the `pages/index.ts` file and add an exported function named `getServerSideProps`:

    ```ts
    export async function getServerSideProps() {
        const data = JSON.stringify({ time: new Date() });
        return { props: { data } };
    }
    ```

1. Update the `Home` component to recieve the server-rendered data:

    ```ts
    export default function Home({ data }: { data: { time: string } }) {
        const serverData = JSON.parse(data);
    ```

1. Output the server-rendered data in part of the HTML content for the page, then commit and push the changes.

Once the changes are pushed, a new GitHub Actions workflow will be triggered and the changes will be deployed to your site.

## Adding an API route

Next.js has [API routes](https://nextjs.org/docs/api-routes/introduction) which is an alternative to Azure Functions for creating APIs for the Next.js client application.

Let's add an API route:

1. Create a new file at `pages/api/time.ts`.
1. Add a handler function to return some data from the API:

    ```ts
    import type { NextApiRequest, NextApiResponse } from "next";

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.status(200).json({ time: new Date() });
    }
    ```

1. Open `pages/index.ts` to add a call to the API, and display the result:

    ```ts
    export default function Home({ data }: { data: { time: string } }) {
        const [time, setTime] = useState<Date?>(null);
        useEffect(() => {
            fetch('/api/time')
            .then(res => res.json())
            .then(json => setTime(new Date(json.time)));
        }, []);
    }
    ```

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-nextjs-group** from the top search bar.
1. Select on the group name.
1. Select on the **Delete** button.
1. Select **Yes** to confirm the delete action.

> [!div class="nextstepaction"]
> [Set up a custom domain](custom-domain.md)
