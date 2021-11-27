import styled from '@emotion/styled'
import React from 'react'
import { ReceptContent } from '../../graphql/types/ReceptContentType'
import typography from '../../lib/typography';
import Heart from '../../assets/heart-white.svg';
import ReceptTime from '../time/ReceptTime';
import colors from '../../lib/colors';
import ClockIcon from '../../assets/clock.svg'
import Rating from '../rating/Rating';

const Time = styled.div({
    display: 'flex',
    gridTemplateColumns: 'min-content min-content',
    placeItems: 'center',
    gap: '7px',
    justifySelf: 'start',
    alignSelf: 'end',

})

const Clock = styled(ClockIcon)({
    display: 'none',
    height: '13px',
    width: '13px',
})

const TimeText = styled.span({
    ...typography.note,
})

const Card = styled.div(({imgUrl}: {imgUrl: string}) => {
    // 29 / 44
    return {
        minHeight: '220px',
        width: '145px',
        backgroundImage: `url(${imgUrl})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'grid',
        gridTemplateRows: '1fr min-content',
        gridTemplateAreas: `
        "Like"
        "content"
        `
    }
})

const Content = styled.div({
    padding: '10px 20px',
    color: colors.white,
    display: 'grid',
    rowGap: '7px',
    gridTemplateAreas: `
    "Text Text"
    "Time Rating"
    `,

    background: 'linear-gradient(360deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 89.71%)'
})

const HeartIcon = styled(Heart)({
    border: 'none',
    height: '22.5px',
    width: '25px',
    gridArea: 'Like',
    justifySelf: 'end',
    alignSelf: 'start',
    margin: '13px 10px'
})

const CardText = styled.h2({
    ...typography.cardMobile,
    color: colors.white,
    margin: '0px',
    gridArea: 'Text',
    alignSelf: 'end',
    justifySelf: 'center',
})

type Props = {pageContext: ReceptContent}

const ResipeCard = ({pageContext}: Props) => {
    return (
        <Card imgUrl={pageContext.singlePaketAfc.images[0].localFile.childrenImageSharp[0].original.src}>
            <HeartIcon />
            <Content>
                <CardText>{pageContext.title}</CardText>
                <Time>
                    <Clock />
                    <TimeText>{pageContext.singlePaketAfc.tid} {pageContext.singlePaketAfc.tidFormat === 'min' ? 'min' : 'h'}</TimeText>
                </Time>
                <Rating style={{ gridArea: 'Rating', justifySelf: 'end'}} rating={4.2} />
            </Content>
        </Card>
    )
}

export default ResipeCard
