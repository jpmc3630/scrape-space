import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


function CommentsModal(props) {
    
    const [comments, setComments] = useState([]);
    const [intervalIsSet, setIntervalIsSet] = useState(false);
    const [show, setShow] = useState(false);
    const [usernameText, setUsernameText] = useState('');
    const [bodyText, setBodyText] = useState('');
  
    const handleClose = () => {
        //hide modal
        setShow(false);
        //clear comment refresh timer
        if (intervalIsSet) {
            clearInterval(intervalIsSet);
            setIntervalIsSet(false);
        }
    }

    const handleShow = () => {
        //load comments
        loadComments();
        //show modal
        setShow(true);
        //start comment refresh timer
        if (!intervalIsSet) {
            var interval = setInterval(loadComments, 10000);
            setIntervalIsSet(interval);
          }
        }

    const loadComments = () => {
        axios
        .get(
          `/comments/${props.artId}`
        )
        .then(({ data }) => {
              setComments(data.data);
              console.log(data.data);
              });
    }
      
    const submitComment = async () => {
        
        await axios.post('/submit', {
            articleId : props.artId,
            username : usernameText,
            body : bodyText
        });

        loadComments();
      };
      

    return (
        
      <>
        <Button variant="secondary" size="sm" onClick={handleShow}>
          Show Comments ({props.comments.length})
        </Button>
        
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.artTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ul>
                  {comments.length <= 0
                  ? "NO COMMENTS YET"
                  : 
                  comments.map((comment) =>
                  <li key={comment._id}>{comment.username}: {comment.body}</li>)
                  }
              </ul>
            </div>

        <div style={{ padding: '10px' }}>
            <input
                type="text"
                onChange={(e) => setUsernameText(e.target.value)}
                placeholder="Name"
                className="comment-text"
                
            />
            <input
                type="text"
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Comment..."
                className="comment-body"
                wrap="hard"
                cols={40}
                rows={10}
            />
            <Button variant="secondary" size="sm" onClick={submitComment}>
                Comment
            </Button>
        </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default CommentsModal;
