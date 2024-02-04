import logging

import flask
from flask import request

logging.basicConfig(level=logging.INFO)
_LOGGER = logging.getLogger("app")

app = flask.Flask(__name__)

@app.route("/heartrate", methods=["POST"])
def consume_terra_webhook() -> flask.Response:
  # Note that you may wish to do signature verification here
  # however that is not covered by this recipe. See the
  # webhook signature verification recipe for more on that.
  body = request.get_json()
  
  # See example_heart_rate_data.json for an example of the expected return format
  if body.get("data", {}) is not None:
    heart_rate_data = body.get("data", {})[0].get("heart_rate_data", {}).get("detailed", {}).get("hr_samples", {})
    return heart_rate_data
  
  return flask.Response(status=200)

if __name__ == "__main__":
  app.run(debug=True)