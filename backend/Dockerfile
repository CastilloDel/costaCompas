FROM python:3.7-alpine
WORKDIR /app
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
EXPOSE 5000
COPY . .
RUN pip install -r requirements.txt
CMD ["flask", "--debug", "run"]
