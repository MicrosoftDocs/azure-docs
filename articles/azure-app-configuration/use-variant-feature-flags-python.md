---
title: 'Tutorial:  Use variant feature flags in Azure App Configuration'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to set up and use variant feature flags in an App Configuration
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my application.
author: mrm9084
ms.author: mametcal
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 10/28/2024
---

# Tutorial: Use variant feature flags in Azure App Configuration (preview)

Variant feature flags enable your application to support multiple variants of a feature. The variants of your feature can be assigned to specific users, groups, or percentile buckets. Variants can be useful for feature rollouts, configuration rollouts, and feature experimentation (also known as A/B testing).

> [!NOTE]
> A quicker way to start your variant journey is to run the [Quote of the Day AZD sample.](https://github.com/Azure-Samples/quote-of-the-day-python/)- This repository provides a comprehensive example, complete with variants and Azure resource provisioning.

In this tutorial, you:

> [!div class="checklist"]
> * Create a variant feature flag
> * Set up an app to consume variant feature flags

## Prerequisites

* An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
* An [App Configuration store](./quickstart-azure-app-configuration-create.md).

## Create a variant feature flag

Create a variant feature flag called *Greeting* with no label and three variants, *None*, *Simple*, and *Long*. Creating variant flags is described in the [Feature Flag quickstart](./manage-feature-flags.md#create-a-variant-feature-flag-preview).

| Variant Name | Variant Value | Allocation| 
|---|---|---|
| None *(Default)* | null | 50% |
| Simple | "Hello!" | 25% |
| Long | "I hope this makes your day!" | 25% | 

## Set up an app to use the variants

In this example, you create a Python Flask web app named _Quote of the Day_. When the app is loaded, it displays a quote. Users can interact with the heart button to like it. To improve user engagement, you want to explore whether a personalized greeting message increases the number of users who like the quote. Users who receive the _None_ variant see no greeting. Users who receive the _Simple_ variant get a simple greeting message. Users who receive the _Long_ variant get a slightly longer greeting. 

### Create an app and add user secrets

1. Create a new project folder named *QuoteOfTheDay*.

1. Create a virtual environment in the *QuoteOfTheDay* folder.

    ```bash
    python -m venv venv
    ```

1. Activate the virtual environment.

    ```bash
    .\venv\Scripts\Activate
    ```

1. Install the required packages.

    ```bash
    pip install flask azure-appconfiguration-provider==2.0.0b2 azure-identity featuremanagement[AzureMonitor]==2.0.0b2 flask-login flask_sqlalchemy flask_bcrypt azure-monitor-opentelemetry
    ```

1. Create a new file named *app.py* in the *QuoteOfTheDay* folder.

    ```python
    import os
    from azure.appconfiguration.provider import load
    from featuremanagement import FeatureManager
    from featuremanagement.azuremonitor import publish_telemetry
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace
    from opentelemetry.trace import get_tracer_provider
    from flask_bcrypt import Bcrypt
    
    from flask_sqlalchemy import SQLAlchemy
    from flask_login import LoginManager
    
    DEBUG = True
    
    configure_azure_monitor(connection_string=os.getenv("ApplicationInsightsConnectionString"))
    
    from flask import Flask
    
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    bcrypt = Bcrypt(app)
    
    tracer = trace.get_tracer(__name__, tracer_provider=get_tracer_provider())
    
    CONNECTION_STRING = os.getenv("AzureAppConfigurationConnectionString")
    
    def callback():
        app.config.update(azure_app_config)
    
    global azure_app_config
    azure_app_config = load(
        connection_string=CONNECTION_STRING,
        on_refresh_success=callback,
        feature_flag_enabled=True,
        feature_flag_refresh_enabled=True,
    )
    app.config.update(azure_app_config)
    feature_manager = FeatureManager(azure_app_config, on_feature_evaluated=publish_telemetry)
    
    db = SQLAlchemy()
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    
    
    from .model import Users
    
    @login_manager.user_loader
    def loader_user(user_id):
        return Users.query.get(user_id)
    
    with app.app_context():
        db.create_all()
    
    if __name__ == "__main__":
        app.run(debug=True)
    
    from . import routes
    app.register_blueprint(routes.bp)
    ```

1. Create a new file called *model.py* in the *QuoteOfTheDay* folder.

    ```python
    from dataclasses import dataclass
    from flask_login import UserMixin
    from . import db
    
    
    
    @dataclass
    class Quote:
        message: str
        author: str
    
    
    # Create user model
    class Users(UserMixin, db.Model):
    
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(250), unique=True, nullable=False)
        password_hash = db.Column(db.String(250), nullable=False)
    
        def __init__(self, username, password):
            self.username = username
            self.password_hash = password
    ```

1. Create a new file called *routes.py* in the *QuoteOfTheDay* folder.

    ```python
    import random
    
    from featuremanagement.azuremonitor import track_event
    from flask import Blueprint, render_template, request, flash, redirect, url_for
    from flask_login import current_user, login_user, logout_user
    from . import azure_app_config, feature_manager, db, bcrypt
    from .model import Quote, Users
    
    bp = Blueprint("pages", __name__)
    
    @bp.route("/", methods=["GET", "POST"])
    def index():
        global azure_app_config
        # Refresh the configuration from App Configuration service.
        azure_app_config.refresh()
        context = {}
        user = ""
        if current_user.is_authenticated:
            user = current_user.username
            context["user"] = user
        else:
            context["user"] = "Guest"
        if request.method == "POST":
            track_event("Liked", user)
            return redirect(url_for("pages.index"))
    
        quotes = [
            Quote("You cannot change what you are, only what you do.", "Philip Pullman"),
        ]
    
        greeting = feature_manager.get_variant("Greeting", user)
        show_greeting = ""
        if greeting:
            show_greeting = greeting.configuration
    
        context["model"] = {}
        context["model"]["show_greeting"] = show_greeting
        context["model"]["quote"] = {}
        context["model"]["quote"] = random.choice(quotes)
        context["isAuthenticated"] = current_user.is_authenticated
    
        return render_template("index.html", **context)
    
    @bp.route("/privacy", methods=["GET"])
    def privacy():
        context = {}
        user = ""
        if current_user.is_authenticated:
            user = current_user.username
            context["user"] = user
        else:
            context["user"] = "Guest"
        context["isAuthenticated"] = current_user.is_authenticated
        return render_template("privacy.html", **context)
    
    @bp.route("/register", methods=["GET", "POST"])
    def register():
        if request.method == "POST":
            password = request.form.get("password")
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user = Users(request.form.get("username"), hashed_password)
            try:
                db.session.add(user)
                db.session.commit()
            except Exception as e:
                flash("Username already exists")
                return redirect(url_for("pages.register"))
            login_user(user)
    
            return redirect(url_for("pages.index"))
        return render_template("sign_up.html")
    
    
    @bp.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            user = Users.query.filter_by(username=request.form.get("username")).first()
            password = request.form.get("password")
            if user and bcrypt.check_password_hash(user.password_hash, password):
                login_user(user)
                return redirect(url_for("pages.index"))
        return render_template("login.html")
    
    
    @bp.route("/logout")
    def logout():
        logout_user()
        return redirect(url_for("pages.index"))
    ```

1. Create a new folder named *templates* in the *QuoteOfTheDay* folder.

1. Create a new file named *index.html* in the *templates* folder.

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <div class="quote-container">
        <div class="quote-content">
           {% if model.show_greeting %}
                <h3 class="greeting-content">{{model.show_greeting}}</h3>
            {% endif %}
            <br />
            <p class="quote">“{{model.quote.message}}”</p>
            <p>- <b>{{model.quote.author}}</b></p>
        </div>
    
        <div class="vote-container">
            <button class="btn btn-primary" onclick="heartClicked(this)">
                <i class="far fa-heart"></i> <!-- Heart icon -->
            </button>
        </div>
    
        <form action="/" method="post">
        </form>
    </div>
    
    <script>
        function heartClicked(button) {
            var icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
    
            // If the quote is hearted
            if (icon.classList.contains('fas')) {
                // Send a request to the server to save the vote
                fetch('/?handler=HeartQuote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
        }
    </script>
    {% endblock %}
    ```
     
1. Create a new file named *base.html* in the *templates* folder.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QuoteOfTheDay</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="{{ url_for('static', filename='css/site.css') }}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>
    <body>
        <header>
            <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div class="container">
                    <a class="navbar-brand"  href="/">QuoteOfTheDay</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
    
                        <ul class="navbar-nav flex-grow-1">
                            <li class="nav-item">
                                <a class="nav-link text-dark" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-dark" href="/privacy">Privacy</a>
                            </li>
                        </ul>
                        {% block login_partial %}
                        <ul class="navbar-nav">
                        {% if isAuthenticated %}
                            <li class="nav-item">
                                <a  class="nav-link text-dark">Hello {{user}}!</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-dark"  href="/logout">Logout</a>
                            </li>
                        {% else %}
                            <li class="nav-item">
                                <a class="nav-link text-dark"  href="/register">Register</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-dark"  href="/login">Login</a>
                            </li>
                        {% endif %}
                        </ul>
                        {% endblock %}
                    </div>
                </div>
            </nav>
        </header>
        <div class="container">
            <main role="main" class="pb-3">
                {% block content %}
                {% endblock %}
            </main>
        </div>
    </body>
    
    <footer class="border-top footer text-muted">
        <div class="container">
            &copy; 2024 - QuoteOfTheDay - <a href="/privacy">Privacy</a>
        </div>
    </footer>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
    </html>
    ```

1. Create a new file named *sign_up.html* in the *templates* folder.

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <div class="login-container">
      <h1>Create an account</h1>
      <form action="#" method="post">
        <label for="username">Username:</label>
        <input type="text" name="username" />
        <label for="password">Password:</label>
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </form>
    </div>
    {% endblock %}
    ```

1. Create a new file named *login.html* in the *templates* folder.

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <div class="login-container">
      <h1>Login to your account</h1>
      <form action="#" method="post">
        <label for="username">Username:</label>
        <input type="text" name="username" />
        <label for="password">Password:</label>
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </form>
    </div>
    {% endblock %}
    ```

1. Create a new file named *privacy.html* in the *templates* folder.

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <p>Use this page to detail your site's privacy policy.</p>
    {% endblock %}
    ```

1. Create a new folder named *static* in the *QuoteOfTheDay* folder.

1. Create a new folder named *css* in the *static* folder.

1. Create a new file named *site.css* in the *static* folder.

    ```css
    html {
        font-size: 14px;
      }
      
      @media (min-width: 768px) {
        html {
          font-size: 16px;
        }
      }
      
      .btn:focus, .btn:active:focus, .btn-link.nav-link:focus, .form-control:focus, .form-check-input:focus {
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
    
    .login-container {
      background-color: #fff;
      margin: 2em auto;
      padding: 2em;
      border-radius: 8px;
      max-width: 750px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
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
            background-color: #ffffff; /* White background */
            border-color: #ffffff; /* Light blue border */
            color: #333
        }
    
            .vote-container .btn:focus {
                outline: none;
                box-shadow: none;
            }
    
            .vote-container .btn:hover {
                background-color: #F0F0F0; /* Light gray background */
            }
    
    .greeting-content {
        font-family: 'Georgia', serif; /* More artistic font */
    }
    
    .quote-content p.quote {
        font-size: 2em; /* Bigger font size */
        font-family: 'Georgia', serif; /* More artistic font */
        font-style: italic; /* Italic font */
        color: #4EC2F7; /* Medium-light blue color */
    }
    ```

### Build and run the app

1. In the command prompt, in the *QuoteOfTheDay* folder, run: `flask run`.
1. Wait for the app to start, and then open a browser and navigate to `http://localhost:5000/`.
1. Once viewing the running application, select **Register** at the top right to register a new user.

    :::image type="content" source="media/use-variant-feature-flags-python/register.png" alt-text="Screenshot of the Quote of the day app, showing Register.":::

1. Register a new user named *usera@contoso.com*.

    > [!NOTE]
    > It's important for the purpose of this tutorial to use these names exactly. As long as the feature has been configured as expected, the two users should see different variants.

1. Select the **Submit** button after entering user information.

1. You're automatically logged in. You should see that usera@contoso.com sees the long message when viewing the app.

    :::image type="content" source="media/use-variant-feature-flags-python/special-message.png" alt-text="Screenshot of the Quote of the day app, showing a special message for the user.":::

1. Logout with using the **Logout** button in the top right.

1. Register a second user named *userb@contoso.com*.

1. You're' automatically logged in. You should see that userb@contoso.com sees the short message when viewing the app.

    :::image type="content" source="media/use-variant-feature-flags-python/message.png" alt-text="Screenshot of the Quote of the day app, showing a message for the user.":::

## Next steps

For the full feature rundown of the Python feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [Python Feature Management](./feature-management-python-reference.md)