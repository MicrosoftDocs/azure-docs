---
author: anthonychu
ms.service: container-apps
ms.topic:  include
ms.date: 05/08/2024
ms.author: antchu
---

1. Run the sample app:

    ```bash
    fastapi dev main.py
    ```

1. Open a browser and navigate to `http://localhost:8000/docs`. You see the Swagger UI for the sample app.

1. Expand the `/chat` endpoint and select **Try it out**.

1. Enter `What time is it right now?` in the `message` field and select **Execute**.

    The agent responds with the current time. In the terminal, you see the logs showing the agent generated Python code to get the current time and ran it in a code interpreter session.

1. To stop the app, enter `Ctrl+C` in the terminal.
