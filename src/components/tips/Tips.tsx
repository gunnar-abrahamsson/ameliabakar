import styled from '@emotion/styled'
import React from 'react'
import tipsImg from './tips.png';
import H2 from '../typography/h2/H2';
import { clamp, min } from 'lodash';
import { Link } from 'gatsby';

const TipsImg = styled(Link)({
    backgroundImage: `url(${tipsImg})`,
    backgroundRepeat: 'no-repeat',
    textDecoration: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: 'clamp(2px, 3%, 10px)',
})

const TipsText = styled(H2)({
    textAlign: 'center',
    margin: '0px',
    padding: '20px 0px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
});


const Tips = () => {
    return (
        <TipsImg to={'/tips'}>
            <TipsText>TIPS</TipsText>
        </TipsImg>
    )
}

export default Tips
