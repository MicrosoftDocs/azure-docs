---
title: 'Use variant feature flags in a Spring Boot application'
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to use variant feature flags in a Spring Boot application
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my Spring Boot application.
author: mrm9084
ms.author: mametcal
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: tutorial
ms.date: 02/10/2026
---

# Tutorial: Use variant feature flags in a Spring Boot application

In this tutorial, you use a variant feature flag to manage experiences for different user segments in an example application, *Quote of the Day*. You utilize the variant feature flag created in [Use variant feature flags](./howto-variant-feature-flags.md). Before proceeding, ensure you create the variant feature flag named *Greeting* in your App Configuration store.

## Prerequisites

* A supported [Java Development Kit (JDK)](/java/azure/jdk) with version 17 or later.
* [Apache Maven](https://maven.apache.org/download.cgi) version 3.0 or later.
* Follow the [Use variant feature flags](./howto-variant-feature-flags.md) tutorial and create the variant feature flag named *Greeting*.

## Set up a Spring Boot web app

If you already have a Spring Boot web app with authentication, you can skip to the [Use the variant feature flag](#use-the-variant-feature-flag) section.

1. Browse to the [Spring Initializr](https://start.spring.io) and create a new project with the following options:
    * Generate a **Maven** project with **Java**.
    * Specify a **Spring Boot** version that's 3.0 or later.
    * Set the **Group** to `com.example` and **Artifact** to `quoteoftheday`.
    * Add the **Spring Web**, and **Thymeleaf** dependencies.

1. After you specify the options, select **Generate** to download the project. Extract the files to your local system.

## Create the Quote of the Day app

1. Create a new file named *Quote.java* in the `src/main/java/com/example/quoteoftheday` folder with the following content. It defines a data class for quotes.

    ```java
    package com.example.quoteoftheday;

    public record Quote(String message, String author) {
    }
    ```

1. Create a new file named *HomeController.java* with the following content. It handles the home page display with a random quote.

    ```java
    package com.example.quoteoftheday;

    import java.util.List;
    import java.util.Random;

    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;

    @Controller
    public class HomeController {

        private final List<Quote> quotes = List.of(
                new Quote("You cannot change what you are, only what you do.", "Philip Pullman"));

        private final Random random = new Random();

        @GetMapping("/")
        public String index(Model model) {
            String greetingMessage = "Hi";
            model.addAttribute("greetingMessage", greetingMessage);
            model.addAttribute("quote", quotes.get(random.nextInt(quotes.size())));

            return "index";
        }
    }
    ```

1. Create the *templates* directory at `src/main/resources/templates` and add a new file named *index.html* with the following content:

    ```html
    <!DOCTYPE html>
    <html lang="en" xmlns:th="http://www.thymeleaf.org">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QuoteOfTheDay</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" th:href="@{/css/site.css}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>
    <body>
        <header>
            <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div class="container">
                    <a class="navbar-brand" href="/">QuoteOfTheDay</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        </header>
        <div class="container">
            <main role="main" class="pb-3">
                <div class="quote-container">
                    <div class="quote-content">
                        <h3 class="greeting-content" th:if="${greetingMessage}" th:text="${greetingMessage}"></h3>
                        <br />
                        <p class="quote">"<span th:text="${quote.message}"></span>"</p>
                        <p>- <b th:text="${quote.author}"></b></p>
                    </div>

                    <div class="vote-container">
                        <button class="btn btn-primary" onclick="heartClicked(this)">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </main>
        </div>
        <footer class="border-top footer text-muted">
            <div class="container">
                &copy; 2024 - QuoteOfTheDay
            </div>
        </footer>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
        <script>
            function heartClicked(button) {
                var icon = button.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        </script>
    </body>
    </html>
    ```

1. Create the *static/css* directory at `src/main/resources/static/css` and add a new file named *site.css* with the following content:

    ```css
    html {
        font-size: 14px;
    }

    @media (min-width: 768px) {
        html {
            font-size: 16px;
        }
    }

    .btn:focus,
    .btn:active:focus,
    .btn-link.nav-link:focus,
    .form-control:focus,
    .form-check-input:focus {
        box-shadow: 0 0 0 0.1rem white, 0 0 0 0.25rem #258cfb;
    }

    html {
        position: relative;
        min-height: 100%;
    }

    body {
        margin-bottom: 60px;
    }

    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
    }

    .quote-container {
        background-color: #fff;
        margin: 2em auto;
        padding: 2em;
        border-radius: 8px;
        max-width: 750px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: start;
        position: relative;
    }

    .vote-container {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 0em;
    }

    .vote-container .btn {
        background-color: #ffffff;
        border-color: #ffffff;
        color: #333
    }

    .vote-container .btn:focus {
        outline: none;
        box-shadow: none;
    }

    .vote-container .btn:hover {
        background-color: #F0F0F0;
    }

    .greeting-content {
        font-family: 'Georgia', serif;
    }

    .quote-content p.quote {
        font-size: 2em;
        font-family: 'Georgia', serif;
        font-style: italic;
        color: #4EC2F7;
    }
    ```

1. Update the *application.properties* file at `src/main/resources/application.properties` with the following content:

    ```properties
    spring.application.name=quoteoftheday
    ```

## Use the variant feature flag

1. Open the *pom.xml* file and add the following dependencies for Azure App Configuration and feature management:

    ```xml
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-appconfiguration-config</artifactId>
    </dependency>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.azure.spring</groupId>
                <artifactId>spring-cloud-azure-dependencies</artifactId>
                <version>7.0.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    ```

1. Update the *application.properties* file at `src/main/resources/application.properties` to add Azure App Configuration settings:

    You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.
    
    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```properties
    spring.config.import=azureAppConfiguration
    spring.cloud.azure.appconfiguration.stores[0].endpoint=${APP_CONFIGURATION_ENDPOINT}
    spring.cloud.azure.appconfiguration.stores[0].feature-flags.enabled=true
    ```

    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ### [Connection string](#tab/connection-string)

    ```properties
    spring.config.import=azureAppConfiguration
    spring.cloud.azure.appconfiguration.stores[0].connection-string=${APP_CONFIGURATION_CONNECTION_STRING}
    spring.cloud.azure.appconfiguration.stores[0].feature-flags.enabled=true
    ```

    ---

1. Create a new file named *QueryStringTargetingContextAccessor.java* to provide the targeting context for the current user:

    ```java
    package com.example.quoteoftheday;

    import org.springframework.stereotype.Component;
    import org.springframework.web.context.request.RequestContextHolder;
    import org.springframework.web.context.request.ServletRequestAttributes;

    import com.azure.spring.cloud.feature.management.targeting.TargetingContext;
    import com.azure.spring.cloud.feature.management.targeting.TargetingContextAccessor;

    @Component
    public class QueryStringTargetingContextAccessor implements TargetingContextAccessor {

        @Override
        public void configureTargetingContext(TargetingContext context) {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                String userId = attributes.getRequest().getParameter("userId");
                if (userId != null) {
                    context.setUserId(userId);
                }
            }
        }
    }
    ```

1. Update *HomeController.java* to use the variant feature flag:

    ```java
    package com.example.quoteoftheday;

    import java.util.List;
    import java.util.Random;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;

    import com.azure.spring.cloud.feature.management.FeatureManager;
    import com.azure.spring.cloud.feature.management.models.Variant;

    @Controller
    public class HomeController {

        private static final Logger LOGGER = LoggerFactory.getLogger(HomeController.class);

        private final FeatureManager featureManager;

        private final List<Quote> quotes = List.of(
                new Quote("You cannot change what you are, only what you do.", "Philip Pullman"));

        private final Random random = new Random();

        public HomeController(FeatureManager featureManager) {
            this.featureManager = featureManager;
        }

        @GetMapping("/")
        public String index(Model model) {
            // Get the variant for the Greeting feature flag
            String greetingMessage = "";
            Variant variant = featureManager.getVariant("Greeting");
            if (variant != null) {
                Object value = variant.getValue();
                if (value != null) {
                    greetingMessage = value.toString();
                }
            } else {
                LOGGER.warn(
                        "No variant given. Either the feature flag named 'Greeting' is not defined or the variants are not defined properly.");
            }

            model.addAttribute("greetingMessage", greetingMessage);
            model.addAttribute("quote", quotes.get(random.nextInt(quotes.size())));

            return "index";
            }
    }
    ```

## Build and run the app

1. Set an environment variable.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    Set the environment variable named **APP_CONFIGURATION_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx APP_CONFIGURATION_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:APP_CONFIGURATION_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export APP_CONFIGURATION_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

    ### [Connection string](#tab/connection-string)

    Set the environment variable named **APP_CONFIGURATION_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access settings* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx APP_CONFIGURATION_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:APP_CONFIGURATION_CONNECTION_STRING = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export APP_CONFIGURATION_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```

    ---

1. Build and run your Spring Boot application with Maven:

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. Wait for the app to start, and then open a browser and navigate to `http://localhost:8080/`. You should see the default view of the app that doesn't have any greeting message.

    :::image type="content" source="media/how-to-variant-feature-flags-spring-boot/default-variant.png" alt-text="Screenshot of the Quote of the day app, showing no greeting message for the user.":::

1. You can use `userId` query parameter in the url to specify the user ID. Visit `localhost:8080/?userId=UserA` and you see a long greeting message.

    :::image type="content" source="media/how-to-variant-feature-flags-spring-boot/long-variant.png" alt-text="Screenshot of the Quote of the day app, showing long greeting message for the user.":::

1. Try different user IDs to see how the variant feature flag changes the greeting message for different segments of users. Visit `localhost:8080/?userId=UserB` and you see a shorter greeting message.

    :::image type="content" source="media/how-to-variant-feature-flags-spring-boot/simple-variant.png" alt-text="Screenshot of the Quote of the day app, showing simple greeting message for the user.":::

## Next steps

For the full feature rundown of the Spring Boot feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [Use feature flags in a Spring Boot app](./use-feature-flags-spring-boot.md)
