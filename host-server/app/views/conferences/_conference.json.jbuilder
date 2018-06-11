json.extract! conference, :id, :description, :password, :bankpath, :zip, :created_at, :updated_at
json.url conference_url(conference, format: :json)
