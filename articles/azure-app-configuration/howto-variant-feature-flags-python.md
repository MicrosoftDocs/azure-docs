---
title: 'Use variant feature flags in a Python application'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to use variant feature flags in a Python application
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my python application.
author: mrm9084
ms.author: mametcal
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: how-to
ms.date: 12/02/2024
---

# Use variant feature flags in a Python application

In this tutorial, you use a variant feature flag to manage experiences for different user segments in an example application, *Quote of the Day*. You utilize the variant feature flag created in [How to variant feature flags](./howto-variant-feature-flags.md). Before proceeding, ensure you create the variant feature flag named *Greeting* in your App Configuration store.

## Prerequisites

* Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)
* Follow the [How to variant feature flags](./howto-variant-feature-flags.md) tutorial and create the variant feature flag named *Greeting*.

## Set up a Python Flask web app

If you already have a Python Flask web app, you can skip to the [Use the variant feature flag](#use-the-variant-feature-flag) section.

1. Create a new project folder named *QuoteOfTheDay*.

1. Create a virtual environment in the *QuoteOfTheDay* folder.

    ```bash
    python -m venv venv
    ```

1. Activate the virtual environment.

    ```bash
    .\venv\Scripts\Activate
    ```

1. Install the latest versions of the following packages.

    ```bash
    pip install flask
    pip install flask-login
    pip install flask_sqlalchemy
    pip install flask_bcrypt
    ```

## Create the Quote of the Day app

1. Create a new file named `app.py` in the `QuoteOfTheDay` folder with the following content. It sets up a basic Flask web application with user authentication.

    ```python
    from flask_bcrypt import Bcrypt
    from flask_sqlalchemy import SQLAlchemy
    from flask_login import LoginManager
    from flask import Flask
    
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    bcrypt = Bcrypt(app)
    
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

1. Create a new file named *model.py* in the *QuoteOfTheDay* folder with the following content. It defines a `Quote` data class and a user model for the Flask web application.

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

1. Create a new file named *routes.py* in the *QuoteOfTheDay* folder with the following content. It defines routes for the Flask web application, handling user authentication and displaying a homepage with a random quote.

    ```python
    import random
    
    from flask import Blueprint, render_template, request, flash, redirect, url_for
    from flask_login import current_user, login_user, logout_user
    from . import db, bcrypt
    from .model import Quote, Users
    
    bp = Blueprint("pages", __name__)
    
    @bp.route("/", methods=["GET", "POST"])
    def index():
        context = {}
        user = ""
        if current_user.is_authenticated:
            user = current_user.username
            context["user"] = user
        else:
            context["user"] = "Guest"
        if request.method == "POST":
            return redirect(url_for("pages.index"))
    
        quotes = [
            Quote("You cannot change what you are, only what you do.", "Philip Pullman"),
        ]
    
        greeting_message = "Hi"
    
        context["model"] = {}
        context["model"]["greeting_message"] = greeting_message
        context["model"]["quote"] = {}
        context["model"]["quote"] = random.choice(quotes)
        context["isAuthenticated"] = current_user.is_authenticated
    
        return render_template("index.html", **context)
    
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

1. Create a new folder named *templates* in the *QuoteOfTheDay* folder and add a new file named *base.html* in it with the following content. It defines the layout page for the web application.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QuoteOfTheDay</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <link rel="stylesheet" href="{{ url_for('static', filename='site.css') }}">
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
            &copy; 2024 - QuoteOfTheDay
        </div>
    </footer>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
    </html>
    ```

1. Create a new file named *index.html* in the *templates* folder with the following content. It extends the base template and adds the content block.

    ```html
    {% extends 'base.html' %}
    
    {% block content %}
    <div class="quote-container">
        <div class="quote-content">
           {% if model.greeting_message %}
                <h3 class="greeting-content">{{model.greeting_message}}</h3>
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
        }
    </script>
    {% endblock %}
    ```

1. Create a new file named *sign_up.html* in the *templates* folder with the following content. It defines the template for the user registration page.

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

1. Create a new file named *login.html* in the *templates* folder with the following content. It defines the template for the user login page.

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

1. Create a new folder named *static* in the *QuoteOfTheDay* folder and add a new file named *site.css* in it with the following content. It adds CSS styles for the web application.

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

## Use the variant feature flag

1. Install the latest versions of the following packages.

    ```bash
    pip install azure-identity 
    pip install azure-appconfiguration-provider
    pip install featuremanagement[AzureMonitor]
    ```

1. Open the `app.py` file and add the following code to the end of the file. It connects to App Configuration and sets up feature management.

   You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    import os
    from azure.appconfiguration.provider import load
    from featuremanagement import FeatureManager
    from azure.identity import DefaultAzureCredential

    ENDPOINT = os.getenv("AzureAppConfigurationEndpoint")

    # Updates the flask app configuration with the Azure App Configuration settings whenever a refresh happens
    def callback():
        app.config.update(azure_app_config)

    # Connect to App Configuration
    global azure_app_config
    azure_app_config = load(
        endpoint=ENDPOINT,
        credential=DefaultAzureCredential(),
        on_refresh_success=callback,
        feature_flag_enabled=True,
        feature_flag_refresh_enabled=True,
    )
    app.config.update(azure_app_config)

    # Create a FeatureManager
    feature_manager = FeatureManager(azure_app_config)
    ```

1. Open `routes.py` and add the following code to the end of it to refresh configuration and get the feature variant.

    ```python
    from featuremanagement.azuremonitor import track_event
    from . import azure_app_config, feature_manager

    ...
    # Update the post request to track liked events
    if request.method == "POST":
        track_event("Liked", user)
        return redirect(url_for("pages.index"))

    ...
    # Update greeting_message to variant
    greeting = feature_manager.get_variant("Greeting", user)
    greeting_message = ""
    if greeting:
        greeting_message = greeting.configuration
    ```

## Build and run the app

1. Set an environment variable named **AzureAppConfigurationEndpoint** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AzureAppConfigurationEndpoint "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AzureAppConfigurationEndpoint = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AzureAppConfigurationEndpoint='<endpoint-of-your-app-configuration-store'
    ```

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

1. You're automatically logged in. You should see that userb@contoso.com sees the short message when viewing the app.

    :::image type="content" source="media/use-variant-feature-flags-python/message.png" alt-text="Screenshot of the Quote of the day app, showing a message for the user.":::

## Next steps

For the full feature rundown of the Python feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [Python Feature Management](./feature-management-python-reference.md)