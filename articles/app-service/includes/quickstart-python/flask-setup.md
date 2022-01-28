Download or clone the sample application to your local workstation.

```terminal
git clone https://github.com/Azure-Samples/python-docs-hello-world
```

Follow these instructions to run the sample app locally.

#### [Mac/Linux](#tab/mac-linux)

```Bash
cd python-docs-hello-world

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the app
flask run
```

#### [Windows (CMD prompt)](#tab/windows)

```dos
cd python-docs-hello-world

REM Create a virtual environment
py -3 -m venv .venv
.venv\scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Run the app
flask run
```
---