class CreateConferences < ActiveRecord::Migration[5.2]
  def change
    create_table :conferences do |t|
      t.text :description
      t.string :password
      t.string :bankpath
      t.string :zip

      t.timestamps
    end
  end
end
