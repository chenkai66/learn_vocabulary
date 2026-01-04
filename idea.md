# Vocabulary Learning Web Application

## Project Overview
A web application that generates advanced English vocabulary through AI prompts, stores learning history locally, and provides a structured learning experience with thematic word sets and narrative contexts.

## Core Features

### 1. AI-Powered Vocabulary Generation
- Uses a large language model to generate sets of 10 advanced English words
- Words are thematically connected but play distinct roles (not synonyms)
- Each word includes: English word with POS, Chinese definition, memory aids, and example sentences
- Generates a mini-narrative story incorporating 6-8 of the words

### 2. Local Data Persistence
- Stores all generated vocabulary and stories in JSON format
- Uses `--data-dir` flag to specify storage location
- Loads existing data on application startup
- Maintains complete learning history

### 3. Learning History Interface
- Displays previously generated vocabulary cards
- Shows associated stories and learning context
- Tracks learning progress and review history

### 4. Review Functionality
- Allows users to review previously learned words without calling the LLM
- Provides interactive matching exercise: 5 words on left, 5 definitions/contexts on right
- Users match words with their definitions/contexts by clicking pairs
- Uses historical vocabulary data from local storage for review exercises
- Offers memory reinforcement through interactive matching

## Technical Architecture

### Frontend
- Modern web framework (React/Vue)
- Responsive design for multiple devices
- Card-based UI for vocabulary display
- Interactive elements for review sessions

### Backend
- Node.js server with Express
- File system operations for data persistence
- API endpoints for data retrieval and storage
- Configuration for data directory specification

### Data Model
JSON structure containing:
- Vocabulary sets with metadata
- Thematic word groups
- Mini-narrative stories
- User interaction history
- Review status and timestamps

## User Experience Flow

1. **Initial Load**: Application loads existing vocabulary data from specified directory
2. **Generation**: User requests new vocabulary set, AI generates content and saves to JSON
3. **Learning**: User studies the 10-word set and accompanying story
4. **Review**: User can revisit previous sets with interactive questioning
5. **History**: User can browse all previously generated content

## Implementation Considerations

### Data Persistence
- JSON format for easy readability and debugging
- Structured organization by date/session
- Backup and recovery mechanisms
- Data validation and integrity checks

### Performance
- Efficient loading of large datasets
- Caching mechanisms for frequently accessed content
- Lazy loading for history browsing

### Scalability
- Modular architecture for feature additions
- Clean separation of concerns
- Extensible data model for additional learning features