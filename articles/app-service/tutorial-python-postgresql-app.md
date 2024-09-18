---
++ content.md
        **Step 3:** In a terminal or command prompt, run the following Python script to generate a unique secret: `python -c 'import secrets; print(secrets.token_hex())'`. Copy the output value to use in the next step.
    :::column-end:::
    :::column:::
    :::column span="2":::
        **Step 4:** Back in the **Configuration** page, select **New application setting**. Name the setting `SECRET_KEY`. Paste the value from the previous value. Select **OK**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting.png" alt-text="A screenshot showing how to set the SECRET_KEY app setting in the Azure portal (Flask)." lightbox="./media/tutorial-python-postgresql-app/azure-portal-app-service-app-setting.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column-end:::
:::row-end:::

