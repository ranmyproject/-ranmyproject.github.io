import React from 'react'
import {Redirect,Link} from 'react-router-dom';

export default function Dashboard(props){

    return(
        <div class="container">
        <div class="top-block">
            <div class="user-heading">
                <p>Administrator</p>
            </div>
        </div>
        <div class="middle-blocks">
            <div class="block-1">
                <div class="entry-count">21</div>
                <div class="submissions">Pending</div>
            </div>
            <div class="block-2">
                <div class="entry-count">15</div>
                <div class="submissions">Approved</div>
            </div>
        </div>          
            <div class="block-4">
                <input class="submission-block" name="submit" type="submit" value="Make another submission"/>
            </div>  
    </div>
    )
}