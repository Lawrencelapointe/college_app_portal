# Terraform configuration for GlidrU Firestore resources

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  description = "GCP Project ID"
  default     = "glidru"
}

provider "google" {
  project = var.project_id
}

# Firestore database (if not already created)
resource "google_firestore_database" "database" {
  name        = "(default)"
  location_id = "us-central"
  type        = "FIRESTORE_NATIVE"
}

# Composite index for user-specific questions
resource "google_firestore_index" "questions_user_index" {
  project    = var.project_id
  database   = google_firestore_database.database.name
  collection = "questions"

  fields {
    field_path = "userId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "ASCENDING"
  }
}

# Optional: Additional index for filtering by class
resource "google_firestore_index" "questions_class_index" {
  project    = var.project_id
  database   = google_firestore_database.database.name
  collection = "questions"

  fields {
    field_path = "userId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "CLASS"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "ASCENDING"
  }
}
